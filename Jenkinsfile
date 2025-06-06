// Filename: Jenkinsfile

pipeline {
    agent {
        dockerfile {
            filename 'Dockerfile.jenkins-agent'
        }
    }

    environment {
        DOTNET_ROOT = "/usr/share/dotnet"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Start OracleDB') {
            steps {
                echo '🟡 Starting OracleDB Docker container...'
                sh 'docker start oracle-xe || echo "Container already running or does not exist"'
            }
        }

        stage('Build Backend (.NET)') {
            steps {
                dir('backend') {
                    sh 'dotnet restore'
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