// TEMPORARY DIAGNOSTIC JENKINSFILE

pipeline {
    // Use any available agent, likely the Jenkins controller itself
    agent any

    stages {
        stage('Diagnostic Checkout') {
            steps {
                echo "Attempting to checkout code on the base Jenkins agent..."
                checkout scm
                echo "SUCCESS! Code was checked out."
                sh 'ls -la'
            }
        }
    }
}