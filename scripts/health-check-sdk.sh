#!/bin/bash

# Lark Dashboard SDK - Health Check Script
# Performs comprehensive health checks on the SDK project
# Usage: bash scripts/health-check-sdk.sh

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PROJECT_ROOT="/Users/mdch/lark-dashboard-sdk"
CHECKS_PASSED=0
CHECKS_FAILED=0
CHECKS_WARNING=0

# Helper functions
print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
    ((CHECKS_PASSED++))
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
    ((CHECKS_FAILED++))
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
    ((CHECKS_WARNING++))
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Check if file exists
check_file_exists() {
    local file=$1
    local description=$2

    if test -f "$file"; then
        print_success "Found $description"
        return 0
    else
        print_error "Missing $description at $file"
        return 1
    fi
}

# Check if directory exists
check_dir_exists() {
    local dir=$1
    local description=$2

    if test -d "$dir"; then
        print_success "Found $description"
        return 0
    else
        print_error "Missing $description at $dir"
        return 1
    fi
}

# Check file for content
check_file_contains() {
    local file=$1
    local pattern=$2
    local description=$3

    if grep -q "$pattern" "$file" 2>/dev/null; then
        print_success "Verified $description"
        return 0
    else
        print_warning "Could not verify $description in $file"
        return 1
    fi
}

# Validate JSON file
validate_json() {
    local file=$1
    local description=$2

    if command -v jq &> /dev/null; then
        if jq empty "$file" 2>/dev/null; then
            print_success "Valid JSON in $description"
            return 0
        else
            print_error "Invalid JSON in $description"
            return 1
        fi
    else
        print_warning "jq not installed, skipping JSON validation for $description"
        return 0
    fi
}

# Check Node.js version
check_nodejs_version() {
    if command -v node &> /dev/null; then
        local node_version=$(node --version)
        print_success "Node.js installed: $node_version"

        # Check minimum version (16.0.0)
        local major=$(echo $node_version | cut -d'v' -f2 | cut -d'.' -f1)
        if [ "$major" -ge 16 ]; then
            print_success "Node.js version meets minimum requirement (16.0.0+)"
            return 0
        else
            print_error "Node.js version is below minimum requirement (16.0.0+)"
            return 1
        fi
    else
        print_error "Node.js is not installed"
        return 1
    fi
}

# Check npm version
check_npm_version() {
    if command -v npm &> /dev/null; then
        local npm_version=$(npm --version)
        print_success "npm installed: v${npm_version}"
        return 0
    else
        print_error "npm is not installed"
        return 1
    fi
}

# Check git configuration
check_git_config() {
    if command -v git &> /dev/null; then
        print_success "Git is installed"

        local git_user=$(git config user.name 2>/dev/null || echo "")
        if [ -n "$git_user" ]; then
            print_success "Git user configured: $git_user"
            return 0
        else
            print_warning "Git user not configured"
            return 0
        fi
    else
        print_warning "Git is not installed"
        return 0
    fi
}

# Check package.json integrity
check_package_json() {
    print_info "Checking package.json..."

    local package_file="${PROJECT_ROOT}/package.json"
    validate_json "$package_file" "package.json" || return 1

    # Check required fields
    local required_fields=("name" "version" "description" "main" "scripts" "dependencies")
    for field in "${required_fields[@]}"; do
        check_file_contains "$package_file" "\"$field\"" "package.json has $field field" || return 1
    done

    # Verify package name
    local package_name=$(grep '"name"' "$package_file" | grep -o '@[^"]*' | head -1)
    if [ "$package_name" = "@hypelab/lark-dashboard-sdk" ]; then
        print_success "Correct package name: $package_name"
    else
        print_warning "Package name differs: $package_name"
    fi

    # Verify version
    local version=$(grep '"version"' "$package_file" | grep -o '[0-9]*\.[0-9]*\.[0-9]*' | head -1)
    print_success "Package version: $version"

    return 0
}

# Check tsconfig.json
check_tsconfig() {
    print_info "Checking TypeScript configuration..."

    local tsconfig_file="${PROJECT_ROOT}/tsconfig.json"

    if [ ! -f "$tsconfig_file" ]; then
        print_warning "tsconfig.json not found"
        return 0
    fi

    validate_json "$tsconfig_file" "tsconfig.json" || return 1
    print_success "TypeScript configuration is valid"

    return 0
}

# Check source files
check_source_files() {
    print_info "Checking source files..."

    local required_files=(
        "${PROJECT_ROOT}/src/index.ts"
        "${PROJECT_ROOT}/src/client.ts"
        "${PROJECT_ROOT}/src/types.ts"
        "${PROJECT_ROOT}/src/mcp-server.ts"
    )

    for file in "${required_files[@]}"; do
        check_file_exists "$file" "$(basename $file)" || return 1
    done

    return 0
}

# Check dist directory
check_dist_directory() {
    print_info "Checking compiled output..."

    if [ ! -d "${PROJECT_ROOT}/dist" ]; then
        print_warning "dist directory not found - run 'npm run build' to compile"
        return 0
    fi

    check_file_exists "${PROJECT_ROOT}/dist/index.js" "compiled index.js" || return 1
    check_file_exists "${PROJECT_ROOT}/dist/index.d.ts" "TypeScript definitions" || return 1
    check_file_exists "${PROJECT_ROOT}/dist/mcp-server.js" "MCP server binary" || return 1

    return 0
}

# Check documentation
check_documentation() {
    print_info "Checking documentation files..."

    local doc_files=(
        "README.md"
        "API.md"
        "CONTRIBUTING.md"
        "LICENSE"
        "CHANGELOG.md"
    )

    local missing_docs=()
    for doc in "${doc_files[@]}"; do
        if ! check_file_exists "${PROJECT_ROOT}/${doc}" "$doc"; then
            missing_docs+=("$doc")
        fi
    done

    if [ ${#missing_docs[@]} -gt 0 ]; then
        print_warning "Missing documentation: ${missing_docs[*]}"
        return 0
    fi

    return 0
}

# Check examples
check_examples() {
    print_info "Checking example files..."

    local examples_dir="${PROJECT_ROOT}/examples"

    if [ ! -d "$examples_dir" ]; then
        print_error "Examples directory not found"
        return 1
    fi

    print_success "Examples directory exists"

    # Count TypeScript examples
    local example_count=$(find "$examples_dir" -name "*.ts" | wc -l)
    if [ "$example_count" -gt 0 ]; then
        print_success "Found $example_count example files"
    else
        print_warning "No example files found"
        return 0
    fi

    # Check essential examples
    local essential_examples=(
        "basic-dashboard.ts"
        "complete-dashboard.ts"
        "permissions-example.ts"
    )

    for example in "${essential_examples[@]}"; do
        if [ -f "$examples_dir/$example" ]; then
            print_success "Found example: $example"
        else
            print_warning "Missing example: $example"
        fi
    done

    return 0
}

# Check tests
check_tests() {
    print_info "Checking test files..."

    local tests_dir="${PROJECT_ROOT}/tests"

    if [ ! -d "$tests_dir" ]; then
        print_warning "Tests directory not found"
        return 0
    fi

    print_success "Tests directory exists"

    local test_count=$(find "$tests_dir" -name "*.test.ts" -o -name "*.spec.ts" | wc -l)
    if [ "$test_count" -gt 0 ]; then
        print_success "Found $test_count test files"
    else
        print_warning "No test files found"
    fi

    return 0
}

# Check dependencies
check_dependencies() {
    print_info "Checking dependencies..."

    local package_file="${PROJECT_ROOT}/package.json"

    # Check for required dependencies
    local required_deps=("axios" "@modelcontextprotocol/sdk")
    for dep in "${required_deps[@]}"; do
        if grep -q "\"$dep\"" "$package_file"; then
            print_success "Dependency found: $dep"
        else
            print_error "Missing dependency: $dep"
            return 1
        fi
    done

    # Check for dev dependencies
    if grep -q "\"devDependencies\"" "$package_file"; then
        print_success "Dev dependencies configured"
    else
        print_warning "No dev dependencies found"
    fi

    return 0
}

# Check npm scripts
check_npm_scripts() {
    print_info "Checking npm scripts..."

    local package_file="${PROJECT_ROOT}/package.json"

    local required_scripts=("build" "test" "lint" "prepare")
    for script in "${required_scripts[@]}"; do
        if grep -q "\"$script\"" "$package_file"; then
            print_success "Script found: npm run $script"
        else
            print_warning "Missing script: npm run $script"
        fi
    done

    return 0
}

# Check .github directory
check_github_config() {
    print_info "Checking GitHub configuration..."

    local github_dir="${PROJECT_ROOT}/.github"

    if [ ! -d "$github_dir" ]; then
        print_warning "GitHub config directory not found"
        return 0
    fi

    print_success "GitHub config directory exists"

    # Check for workflows
    local workflows_dir="${github_dir}/workflows"
    if [ -d "$workflows_dir" ]; then
        local workflow_count=$(ls -1 "$workflows_dir" | wc -l)
        if [ "$workflow_count" -gt 0 ]; then
            print_success "Found $workflow_count GitHub workflow(s)"
        else
            print_warning "No GitHub workflows found"
        fi
    else
        print_warning "No .github/workflows directory found"
    fi

    return 0
}

# Check repository metadata
check_repository_metadata() {
    print_info "Checking repository metadata..."

    local package_file="${PROJECT_ROOT}/package.json"

    # Check repository URL
    if grep -q '"repository"' "$package_file"; then
        local repo_url=$(grep -A1 '"repository"' "$package_file" | grep '"url"' | grep -o 'https[^"]*' | head -1)
        if [ -n "$repo_url" ]; then
            print_success "Repository URL configured: $repo_url"
        fi
    fi

    # Check bugs URL
    if grep -q '"bugs"' "$package_file"; then
        print_success "Bug report URL configured"
    fi

    # Check homepage
    if grep -q '"homepage"' "$package_file"; then
        print_success "Homepage configured"
    fi

    return 0
}

# Check security files
check_security_files() {
    print_info "Checking security configuration..."

    local security_files=(
        ".npmignore"
        ".gitignore"
    )

    for file in "${security_files[@]}"; do
        check_file_exists "${PROJECT_ROOT}/${file}" "$file" || true
    done

    # Check for environment example
    if [ -f "${PROJECT_ROOT}/.env.example" ]; then
        print_success "Environment example found (.env.example)"
    else
        print_warning "No .env.example found"
    fi

    return 0
}

# Run npm audit
check_npm_audit() {
    print_info "Running npm audit..."

    if command -v npm &> /dev/null; then
        if npm audit --audit-level=critical 2>/dev/null; then
            print_success "No critical vulnerabilities found"
            return 0
        else
            print_warning "Potential vulnerabilities detected (run 'npm audit' for details)"
            return 0
        fi
    else
        print_warning "npm not available for audit check"
        return 0
    fi
}

# Generate health report
generate_health_report() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    local report_file="health-check-report-${timestamp// /-}.txt"

    echo "Lark Dashboard SDK - Health Check Report" > "$report_file"
    echo "=========================================" >> "$report_file"
    echo "Timestamp: ${timestamp}" >> "$report_file"
    echo "Project: ${PROJECT_ROOT}" >> "$report_file"
    echo "" >> "$report_file"
    echo "Check Summary:" >> "$report_file"
    echo "  Passed:  ${CHECKS_PASSED}" >> "$report_file"
    echo "  Warnings: ${CHECKS_WARNING}" >> "$report_file"
    echo "  Failed:  ${CHECKS_FAILED}" >> "$report_file"
    echo "" >> "$report_file"

    if [ $CHECKS_FAILED -eq 0 ]; then
        echo "Status: HEALTHY" >> "$report_file"
    else
        echo "Status: NEEDS ATTENTION" >> "$report_file"
    fi

    echo "" >> "$report_file"
    echo "Recommendations:" >> "$report_file"
    echo "  1. Run 'npm install' to ensure all dependencies are installed" >> "$report_file"
    echo "  2. Run 'npm run build' to compile TypeScript code" >> "$report_file"
    echo "  3. Run 'npm test' to validate functionality" >> "$report_file"
    echo "  4. Run 'npm audit' for detailed vulnerability information" >> "$report_file"

    print_success "Health report saved to ${report_file}"
}

# Main health check workflow
main() {
    print_header "Lark Dashboard SDK - Health Check"
    echo ""

    # Environment checks
    print_header "Environment Checks"
    check_nodejs_version
    check_npm_version
    check_git_config
    echo ""

    # Configuration checks
    print_header "Configuration Checks"
    check_package_json
    echo ""
    check_tsconfig
    echo ""

    # File structure checks
    print_header "File Structure Checks"
    check_source_files
    echo ""
    check_dist_directory
    echo ""

    # Content checks
    print_header "Content Checks"
    check_documentation
    echo ""
    check_examples
    echo ""
    check_tests
    echo ""

    # Dependency checks
    print_header "Dependency Checks"
    check_dependencies
    echo ""
    check_npm_scripts
    echo ""

    # Repository checks
    print_header "Repository Configuration"
    check_github_config
    echo ""
    check_repository_metadata
    echo ""
    check_security_files
    echo ""

    # Security checks
    print_header "Security Checks"
    check_npm_audit
    echo ""

    # Summary
    print_header "Health Check Summary"
    echo "Checks Passed:   ${CHECKS_PASSED}"
    echo "Warnings:        ${CHECKS_WARNING}"
    echo "Checks Failed:   ${CHECKS_FAILED}"
    echo ""

    if [ $CHECKS_FAILED -eq 0 ]; then
        print_success "All critical checks passed!"
        print_info "The SDK is in good health."
    else
        print_error "Some checks failed. Please review the output above."
    fi

    generate_health_report
    echo ""

    # Return exit code based on failures
    if [ $CHECKS_FAILED -eq 0 ]; then
        exit 0
    else
        exit 1
    fi
}

# Run main
main "$@"
