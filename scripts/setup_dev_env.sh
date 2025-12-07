#!/bin/bash

# WeightTracker25 Development Environment Setup Script
# This script checks and installs the required dependencies for WeightTracker25 development
# Requirements: .NET 10, Angular 21, Node.js 24, Podman
# Assumes: Git is already installed

set -e # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
	echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
	echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
	echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
	echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running on Fedora
check_os() {
	log_info "Checking operating system..."
	if [ -f /etc/fedora-release ]; then
		FEDORA_VERSION=$(cat /etc/fedora-release | grep -oE '[0-9]+' | head -1)
		log_success "Detected Fedora $FEDORA_VERSION"
		return 0
	else
		log_error "This script is designed for Fedora. Other distributions are not supported."
		exit 1
	fi
}

# Version comparison function
version_compare() {
	if [[ $1 == $2 ]]; then
		return 0
	fi
	local IFS=.
	local i ver1=($1) ver2=($2)
	# fill empty fields in ver1 with zeros
	for ((i = ${#ver1[@]}; i < ${#ver2[@]}; i++)); do
		ver1[i]=0
	done
	for ((i = 0; i < ${#ver1[@]}; i++)); do
		if [[ -z ${ver2[i]} ]]; then
			# fill empty fields in ver2 with zeros
			ver2[i]=0
		fi
		if ((10#${ver1[i]} > 10#${ver2[i]})); then
			return 1
		fi
		if ((10#${ver1[i]} < 10#${ver2[i]})); then
			return 2
		fi
	done
	return 0
}

# Check and install .NET 10
check_install_dotnet() {
	log_info "Checking .NET SDK..."

	if command -v dotnet &>/dev/null; then
		DOTNET_VERSION=$(dotnet --version | cut -d. -f1,2)
		log_info "Found .NET version: $DOTNET_VERSION"

		version_compare $DOTNET_VERSION "10.0"
		case $? in
		0 | 1)
			log_success ".NET $DOTNET_VERSION is installed and meets requirements (>=10.0)"
			return 0
			;;
		2)
			log_warning ".NET $DOTNET_VERSION is older than required version 10.0"
			;;
		esac
	else
		log_warning ".NET SDK not found"
	fi

	log_info "Installing .NET 10 SDK..."

	# Add Microsoft repository if not already added
	if ! dnf repolist | grep -q "packages-microsoft-com"; then
		log_info "Adding Microsoft repository..."
		sudo rpm -Uvh https://packages.microsoft.com/config/fedora/$FEDORA_VERSION/packages-microsoft-prod.rpm
	fi

	# Install .NET SDK
	sudo dnf install -y dotnet-sdk-9.0 || {
		log_warning ".NET 9.0 not available, trying .NET 8.0..."
		sudo dnf install -y dotnet-sdk-8.0
	}

	# Verify installation
	if command -v dotnet &>/dev/null; then
		INSTALLED_VERSION=$(dotnet --version)
		log_success ".NET SDK $INSTALLED_VERSION installed successfully"
	else
		log_error "Failed to install .NET SDK"
		exit 1
	fi
}

# Check and install Node.js 24
check_install_nodejs() {
	log_info "Checking Node.js..."

	if command -v node &>/dev/null; then
		NODE_VERSION=$(node --version | sed 's/v//' | cut -d. -f1)
		log_info "Found Node.js version: $NODE_VERSION"

		if [ "$NODE_VERSION" -ge 24 ]; then
			log_success "Node.js $NODE_VERSION meets requirements (>=24)"
			return 0
		else
			log_warning "Node.js $NODE_VERSION is older than required version 24"
		fi
	else
		log_warning "Node.js not found"
	fi

	log_info "Installing Node.js 24..."

	curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
	# in lieu of restarting the shell
	\. "$HOME/.nvm/nvm.sh"

	# Download and install Node.js:
	nvm install 24

	# Verify installation
	if command -v node &>/dev/null; then
		INSTALLED_VERSION=$(node --version)
		log_success "Node.js $INSTALLED_VERSION installed successfully"
	else
		log_error "Failed to install Node.js"
		exit 1
	fi
}

# Check and install Angular CLI 21
check_install_angular() {
	log_info "Checking Angular CLI..."

	if command -v ng &>/dev/null; then
		ANGULAR_VERSION=$(ng version 2>/dev/null | grep "Angular CLI" | grep -oE '[0-9]+\.[0-9]+' | head -1)
		if [ -n "$ANGULAR_VERSION" ]; then
			log_info "Found Angular CLI version: $ANGULAR_VERSION"

			ANGULAR_MAJOR=$(echo $ANGULAR_VERSION | cut -d. -f1)
			if [ "$ANGULAR_MAJOR" -ge 21 ]; then
				log_success "Angular CLI $ANGULAR_VERSION meets requirements (>=21)"
				return 0
			else
				log_warning "Angular CLI $ANGULAR_VERSION is older than required version 21"
			fi
		else
			log_warning "Could not determine Angular CLI version"
		fi
	else
		log_warning "Angular CLI not found"
	fi

	log_info "Installing Angular CLI 21..."

	# Ensure npm is available
	if ! command -v npm &>/dev/null; then
		log_error "npm is required but not found. Please install Node.js first."
		exit 1
	fi

	# Install Angular CLI globally
	npm install -g @angular/cli@latest

	# Verify installation
	if command -v ng &>/dev/null; then
		INSTALLED_VERSION=$(ng version 2>/dev/null | grep "Angular CLI" | grep -oE '[0-9]+\.[0-9]+' | head -1)
		log_success "Angular CLI $INSTALLED_VERSION installed successfully"
	else
		log_error "Failed to install Angular CLI"
		exit 1
	fi
}

# Check and install Podman
check_install_podman() {
	log_info "Checking Podman..."

	if command -v podman &>/dev/null; then
		PODMAN_VERSION=$(podman --version | grep -oE '[0-9]+\.[0-9]+\.[0-9]+')
		log_success "Podman $PODMAN_VERSION is already installed"
		return 0
	else
		log_warning "Podman not found"
	fi

	log_info "Installing Podman..."

	# Install Podman and related tools
	sudo dnf install -y podman podman-compose podman-docker

	# Verify installation
	if command -v podman &>/dev/null; then
		INSTALLED_VERSION=$(podman --version | grep -oE '[0-9]+\.[0-9]+\.[0-9]+')
		log_success "Podman $INSTALLED_VERSION installed successfully"

		# Configure Podman for rootless operation
		log_info "Configuring Podman for rootless operation..."
		if [ ! -f ~/.config/containers/registries.conf ]; then
			mkdir -p ~/.config/containers
			echo "unqualified-search-registries = ['docker.io']" >~/.config/containers/registries.conf
		fi

		log_info "Testing Podman installation..."
		podman run --rm hello-world 2>/dev/null || log_warning "Podman test failed, but installation appears successful"
	else
		log_error "Failed to install Podman"
		exit 1
	fi
}

# Update system packages
update_system() {
	log_info "Updating system packages..."
	sudo dnf update -y
	log_success "System packages updated"
}

# Main execution
main() {
	log_info "Starting WeightTracker25 development environment setup..."
	echo "=================================================================="

	check_os
	update_system

	log_info "Checking and installing dependencies..."
	echo "------------------------------------------------------------------"

	check_install_dotnet
	echo
	check_install_nodejs
	echo
	check_install_angular
	echo
	check_install_podman

	echo "=================================================================="
	log_success "Development environment setup completed!"

	# Final verification
	echo
	log_info "Final environment verification:"
	echo "------------------------------------------------------------------"

	if command -v dotnet &>/dev/null; then
		echo ".NET SDK: $(dotnet --version)"
	fi

	if command -v node &>/dev/null; then
		echo "Node.js: $(node --version)"
	fi

	if command -v npm &>/dev/null; then
		echo "npm: $(npm --version)"
	fi

	if command -v ng &>/dev/null; then
		ANGULAR_VER=$(ng version 2>/dev/null | grep "Angular CLI" | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1)
		echo "Angular CLI: $ANGULAR_VER"
	fi

	if command -v podman &>/dev/null; then
		echo "Podman: $(podman --version | grep -oE '[0-9]+\.[0-9]+\.[0-9]+')"
	fi

	if command -v git &>/dev/null; then
		echo "Git: $(git --version | grep -oE '[0-9]+\.[0-9]+\.[0-9]+')"
	fi

	echo "=================================================================="
	log_success "Your WeightTracker25 development environment is ready!"
	log_info "You can now proceed with project initialization."
}

# Run main function
main "$@"
