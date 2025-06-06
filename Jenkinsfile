pipeline {
    agent {
        dockerfile {
            filename 'Dockerfile.jenkins-agent'
            // This line forces Docker to rebuild the agent image from scratch,
            // ensuring the version with 'git' installed is used.
            additionalBuildArgs '--no-cache'
        }
    }

    environment {
        DOTNET_ROOT = "/usr/share/dotnet"
    }

    stages {
        // This new stage confirms that git is properly installed in the agent.
        stage('Verify Build Tools') {
            steps {
                echo 'Verifying git installation...'
                sh 'which git'
                sh 'git --version'
                echo 'Verification complete. Git is present.'
            }
        }

        stage('Checkout') {
            steps {
                // This step should now succeed.
                checkout scm
            }
        }

        stage('Start OracleDB') {
            steps {
                echo '🟡 Starting OracleDB Docker container...'
                // Note: The Jenkins agent needs access to the Docker socket for this to work.
                // The 'usermod -aG docker jenkins' command in your Dockerfile handles this.
                sh 'docker start oracle-xe || echo Container already running'
            }
        }

        stage('Build Backend (.NET)') {
            steps {
                dir('backend') {
                    sh 'dotnet nuget list source'
                    sh 'curl -I https://api.nuget.org/v3/index.json'
                    sh 'dotnet restore'
                    sh 'dotnet clean'
                    sh 'dotnet build'
                }
            }
        }

        stage('Build Frontend (Angular)') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'ng build'
                }
            }
        }
    }
}