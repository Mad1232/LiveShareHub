pipeline {
    agent {
        dockerfile {
            filename 'Dockerfile.jenkins-agent'
            additionalBuildArgs '--no-cache'
        }
    }

    environment {
        DOTNET_ROOT = "/usr/share/dotnet"
    }

    stages {
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
                cleanWs() // Clean the workspace to avoid stale files
                // Fix workspace ownership to match the jenkins user
                sh 'chown -R jenkins:jenkins ${WORKSPACE}'
                script {
                    git url: 'https://github.com/Mad1232/LiveShareHub.git', branch: 'main', credentialsId: 'github-token'
                }
            }
        }

        stage('Start OracleDB') {
            steps {
                echo '🟡 Starting OracleDB Docker container...'
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