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
        stage('Start OracleDB') {
            steps {
                echo '🟡 Starting OracleDB Docker container...'
                sh 'docker start oracle-xe || echo Container already running'
            }
        }

        stage('Build Backend (.NET)') {
            steps {
                dir('backend') {
                    sh 'dotnet clean'
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
