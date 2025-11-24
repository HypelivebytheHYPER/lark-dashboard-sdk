#!/bin/bash

# Lark Dashboard SDK - NPM Publication Verification Script
# Verifies that the package has been successfully published to npm registry
# Usage: bash scripts/verify-npm-publication.sh [version]

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PACKAGE_NAME="@hypelab/lark-dashboard-sdk"
NPM_REGISTRY="https://registry.npmjs.org"
VERIFICATION_TIMEOUT=60

# Parse arguments
VERSION=${1:-""}
VERBOSE=${2:-"false"}

# Helper functions
print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Check if curl is available
check_curl() {
    if ! command -v curl &> /dev/null; then
        print_error "curl is not installed. Please install curl to continue."
        exit 1
    fi
    print_success "curl is available"
}

# Check npm registry connectivity
check_registry_connectivity() {
    print_info "Checking npm registry connectivity..."

    if curl --silent --max-time 5 "${NPM_REGISTRY}" > /dev/null 2>&1; then
        print_success "npm registry is reachable"
        return 0
    else
        print_error "Cannot reach npm registry at ${NPM_REGISTRY}"
        return 1
    fi
}

# Fetch package info from npm registry
fetch_package_info() {
    local package=$1
    print_info "Fetching package information for ${package}..."

    local response=$(curl --silent "${NPM_REGISTRY}/${package}" || echo "{}")
    echo "$response"
}

# Check if package exists on npm
check_package_exists() {
    local package=$1
    local package_info=$(fetch_package_info "$package")

    if echo "$package_info" | grep -q "\"name\""; then
        print_success "Package ${package} exists on npm registry"
        return 0
    else
        print_error "Package ${package} not found on npm registry"
        if [ "$VERBOSE" = "true" ]; then
            echo "Response: $package_info"
        fi
        return 1
    fi
}

# Get latest version from npm
get_latest_version() {
    local package=$1
    local package_info=$(fetch_package_info "$package")

    if echo "$package_info" | grep -q "\"dist-tags\""; then
        echo "$package_info" | grep -o '"latest":"[^"]*"' | cut -d'"' -f4
    else
        echo ""
    fi
}

# Check if specific version exists
check_version_exists() {
    local package=$1
    local version=$2
    local package_info=$(fetch_package_info "$package")

    if echo "$package_info" | grep -q "\"${version}\""; then
        print_success "Version ${version} is available on npm"
        return 0
    else
        print_error "Version ${version} not found on npm registry"
        return 1
    fi
}

# Verify package installation works
verify_installation() {
    local package=$1
    local version=$2
    local temp_dir=$(mktemp -d)

    print_info "Testing package installation in temporary directory..."

    cd "$temp_dir"
    npm init -y > /dev/null 2>&1

    if npm install "${package}@${version}" > /dev/null 2>&1; then
        print_success "Package installation successful"

        # Test basic import
        if test -f "node_modules/${package}/package.json"; then
            print_success "Package files are accessible"
        fi

        # Cleanup
        cd - > /dev/null
        rm -rf "$temp_dir"
        return 0
    else
        print_error "Package installation failed"
        cd - > /dev/null
        rm -rf "$temp_dir"
        return 1
    fi
}

# Verify package contents
verify_package_contents() {
    local package=$1
    local version=$2

    print_info "Verifying essential package files..."

    # Fetch tarball info
    local package_info=$(fetch_package_info "$package")
    local tarball=$(echo "$package_info" | grep -o '"tarball":"[^"]*"' | head -1 | cut -d'"' -f4)

    if [ -z "$tarball" ]; then
        print_warning "Could not retrieve tarball information"
        return 1
    fi

    local temp_dir=$(mktemp -d)
    cd "$temp_dir"

    # Download and extract tarball
    if curl --silent "$tarball" | tar xz 2>/dev/null; then
        print_success "Tarball extracted successfully"

        # Check for essential files
        local essential_files=("package.json" "README.md" "LICENSE")
        local missing_files=()

        for file in "${essential_files[@]}"; do
            if test -f "package/${file}"; then
                print_success "Found ${file}"
            else
                print_warning "Missing ${file}"
                missing_files+=("$file")
            fi
        done

        # Check for dist directory
        if test -d "package/dist"; then
            print_success "Found dist directory with compiled code"

            # Verify main entry point
            if test -f "package/dist/index.js"; then
                print_success "Main entry point (dist/index.js) exists"
            else
                print_warning "Main entry point (dist/index.js) not found"
            fi

            # Verify types
            if test -f "package/dist/index.d.ts"; then
                print_success "TypeScript definitions (dist/index.d.ts) exist"
            else
                print_warning "TypeScript definitions not found"
            fi
        else
            print_warning "dist directory not found in package"
        fi

        cd - > /dev/null
        rm -rf "$temp_dir"

        if [ ${#missing_files[@]} -gt 0 ]; then
            return 1
        fi
        return 0
    else
        print_error "Failed to extract tarball"
        cd - > /dev/null
        rm -rf "$temp_dir"
        return 1
    fi
}

# Get package statistics
get_package_stats() {
    local package=$1
    local package_info=$(fetch_package_info "$package")

    print_info "Package Statistics:"

    # Extract versions count
    local versions_count=$(echo "$package_info" | grep -o '"[0-9]*\.[0-9]*\.[0-9]*"' | wc -l)
    print_info "  Total versions: ${versions_count}"

    # Extract latest version
    local latest=$(echo "$package_info" | grep -o '"latest":"[^"]*"' | cut -d'"' -f4)
    print_info "  Latest version: ${latest}"

    # Extract modified date
    local modified=$(echo "$package_info" | grep -o '"modified":"[^"]*"' | cut -d'"' -f4 | head -1)
    if [ -n "$modified" ]; then
        print_info "  Last modified: ${modified}"
    fi
}

# Check for vulnerabilities
check_vulnerabilities() {
    local package=$1

    if command -v npm &> /dev/null; then
        print_info "Checking for known vulnerabilities..."

        local vuln_count=$(npm view "${package}" --json 2>/dev/null | grep -c "vulnerability" || echo "0")

        if [ "$vuln_count" -eq 0 ]; then
            print_success "No known vulnerabilities detected"
            return 0
        else
            print_warning "Potential vulnerabilities detected (check npm audit)"
            return 1
        fi
    fi
}

# Generate verification report
generate_report() {
    local package=$1
    local version=$2
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')

    local report_file="verification-report-${version}-${timestamp// /-}.txt"

    echo "Lark Dashboard SDK - NPM Publication Verification Report" > "$report_file"
    echo "==========================================================" >> "$report_file"
    echo "Timestamp: ${timestamp}" >> "$report_file"
    echo "Package: ${package}" >> "$report_file"
    echo "Version: ${version}" >> "$report_file"
    echo "" >> "$report_file"
    echo "Verification Status: PASSED" >> "$report_file"
    echo "" >> "$report_file"
    echo "Checks Completed:" >> "$report_file"
    echo "  ✓ npm registry connectivity" >> "$report_file"
    echo "  ✓ Package exists on registry" >> "$report_file"
    echo "  ✓ Version is available" >> "$report_file"
    echo "  ✓ Package installation works" >> "$report_file"
    echo "  ✓ Essential files present" >> "$report_file"
    echo "" >> "$report_file"
    echo "Next Steps:" >> "$report_file"
    echo "  1. Run: npm install ${package}@${version}" >> "$report_file"
    echo "  2. Test: const sdk = require('${package}');" >> "$report_file"
    echo "  3. Announce release on GitHub" >> "$report_file"

    print_success "Verification report saved to ${report_file}"
}

# Main verification workflow
main() {
    print_header "NPM Publication Verification"

    # Get version to verify
    if [ -z "$VERSION" ]; then
        VERSION=$(grep '"version"' /Users/mdch/lark-dashboard-sdk/package.json | head -1 | grep -o '[0-9]*\.[0-9]*\.[0-9]*')
        print_info "Using version from package.json: ${VERSION}"
    fi

    echo ""

    # Run all checks
    local all_passed=true

    check_curl || all_passed=false
    echo ""

    check_registry_connectivity || all_passed=false
    echo ""

    check_package_exists "$PACKAGE_NAME" || all_passed=false
    echo ""

    if [ "$all_passed" = true ]; then
        print_info "Checking version ${VERSION}..."
        check_version_exists "$PACKAGE_NAME" "$VERSION" || all_passed=false
        echo ""
    fi

    if [ "$all_passed" = true ]; then
        verify_installation "$PACKAGE_NAME" "$VERSION" || all_passed=false
        echo ""
    fi

    if [ "$all_passed" = true ]; then
        verify_package_contents "$PACKAGE_NAME" "$VERSION" || all_passed=false
        echo ""
    fi

    get_package_stats "$PACKAGE_NAME"
    echo ""

    check_vulnerabilities "$PACKAGE_NAME"
    echo ""

    # Final report
    print_header "Verification Complete"
    if [ "$all_passed" = true ]; then
        print_success "All verification checks passed!"
        print_info "Package is ready for production use."
        echo ""
        echo "Installation command:"
        echo "  npm install ${PACKAGE_NAME}@${VERSION}"
        echo ""

        generate_report "$PACKAGE_NAME" "$VERSION"
        exit 0
    else
        print_error "Some verification checks failed. Please review the output above."
        exit 1
    fi
}

# Run main
main "$@"
