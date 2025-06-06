// Jenkinsfile

pipeline {
    agent {
        dockerfile {
            filename 'Dockerfile.jenkins-agent'
            // This is the key: It forces a fresh build, avoiding cache issues.
            additionalBuildArgs '--no-cache'
        }
    }

    environment {
        DOTNET_ROOT = "/usr/share/dotnet"
    }

    stages {
        // This stage confirms the agent is built correctly
        stage('✅ Verify Tools') {
            steps {
                echo 'Checking for Git...'
                sh 'git --version'
                echo 'Git is surely installed!'
            }
        }

        stage('⬇️ Checkout') {
            steps {
                checkout scm
            }
        }

        stage('▶️ Start OracleDB') {
            steps {
                echo '🟡 Starting OracleDB Docker container...'
                sh 'docker start oracle-xe || echo "Container already running or does not exist"'
            }
        }

        stage('🛠️ Build Backend (.NET)') {
            steps {
                dir('backend') {
                    sh 'dotnet restore'
                    sh 'dotnet build'
                }
            }
        }

        stage('🛠️ Build Frontend (Angular)') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'ng build'
                }
            }
        }
    }
}