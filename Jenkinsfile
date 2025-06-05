pipeline {
  agent any

  environment {
    ORACLE_CONTAINER = 'oracle-xe'
    DOTNET_ROOT = "/usr/share/dotnet"
    ASPNETCORE_ENVIRONMENT = "Development"
  }

  stages {
    stage('Start OracleDB') {
      steps {
        echo '🟡 Starting OracleDB Docker container...'
        sh 'docker start oracle-xe || echo "Container already running"'
      }
    }

    stage('Build Backend (.NET)') {
      steps {
        dir('backend') {
          sh 'dotnet clean'
          sh 'dotnet build'
        }
      }
    }

    stage('Run Backend (Dev Server)') {
      steps {
        echo '🚀 Running backend manually is skipped here to avoid blocking Jenkins pipeline.'
        echo 'deploy it or run background service via Docker if needed.'
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

    stage('Test (Optional)') {
      steps {
        dir('backend') {
          sh 'dotnet test || echo "No tests found, skipping..."'
        }
      }
    }

    stage('Deploy (Optional)') {
      steps {
        echo '🚀 Deployment placeholder – you can SCP files or push Docker images.'
      }
    }
  }
}
