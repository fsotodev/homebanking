pipeline {
    options {
        disableConcurrentBuilds()
    }
    tools {
        nodejs 'nodeJS 14'
    }
    agent {
        kubernetes {
            inheritFrom 'standard-agent'
        }
    }
    stages {
        stage('Initialize Pipeline') {
            steps {
                container ('runner' ){
                    script {
                        //Init common env.
                        common.setEnvVars()
                        //Init Slack Notificacion
                        slackNotif.initSlackMessage()
                        slackNotif.initStageMessage()

                        def props = readProperties file: 'JenkinsParams'
                        env.SLACK_CHANNEL = props['SLACK_CHANNEL']
                        env.PROJECT_NAME = props['PROJECT_NAME']
                        env.REGISTRY_URL = props['REGISTRY_URL']
                        env.REGISTRY_NAME = props['REGISTRY_NAME']
                        env.SHORT_COMMIT = env.GIT_COMMIT.substring(0, 8)
                        env.GIT_REPO_URL = env.GIT_URL_1 ?: env.GIT_URL
                        env.GIT_REPO = env.GIT_REPO_URL.replaceFirst(/^https:\/\/(.*\.git)$/, '$1')
                        env.GIT_REPO_NAME = env.GIT_REPO_URL.replaceFirst(/^.*\/([^\/]+?).git$/, '$1')
                        env.BRANCH_NAME = env.BRANCH_NAME.replaceAll('\\/', '_')
                        def ver_file = readJSON file: 'package.json'
                        env.VERSION = ver_file['version']
                        env.PROJECT_KEY = props['PROJECT_KEY']
                        env.SCAN_SOURCE = props['SCAN_SOURCE']
                        env.SCAN_EXCLUDE_FILES = props['SCAN_EXCLUDE_FILES']
                        if ( env.BRANCH_NAME && env.BRANCH_NAME ==~ /(development|staging|master)/) {
                        env.TAG_NAME = env.BRANCH_NAME
                        }
                        if ( env.CHANGE_TARGET && env.CHANGE_TARGET ==~ /(staging|master)/) {
                        env.TAG_NAME = env.CHANGE_TARGET
                        }
                        slackNotif.updateStageMessage()
                    }
                }
            }
        }
        stage('Download Dependencies') {
            steps {
                container ('runner' ){
                    script{
                        // Init Stage Slack Message
                        slackNotif.initStageMessage()
                        sh 'npm install'
                        slackNotif.updateStageMessage()
                    }
                }
            }
        }
        stage('Unit Test') {
            when {
                anyOf {
                    expression { env.BRANCH_NAME != null && env.BRANCH_NAME ==~ /(feature|bugfix|development).*/ }
                    expression { env.CHANGE_TARGET != null && CHANGE_TARGET ==~ /(development)|(staging)/ }
                }
            }
            steps {
                container ('runner' ){
                    script{
                        // Init Stage Slack Message
                        slackNotif.initStageMessage()
                        echo 'Ejecutando pruebas unitarias'
                        //sh 'npm run test'
                        //sh 'npm run lint'
                        stash name: 'coverage', allowEmpty: true, includes: 'coverage/**'
                        slackNotif.updateStageMessage()
                    }
                }
            }
        }
        stage('Security Scan') {
            when {
                expression { env.BRANCH_NAME != null && env.BRANCH_NAME ==~ /(development)/ } }
            steps {
                script {
                    slackNotif.initStageMessage()    // Init Stage Slack Message
                    securityScan()                   //Security Scans
                    slackNotif.updateStageMessage()  //Update Stage Notificacion
                }
            }
        }
        stage('Deploy-site') {
            steps {
                container ('runner' ) {
                    script {
                         if ("${GIT_BRANCH}" == 'SQFYCC-786-admin-homologar-rama-FYCCN-164') {
                            slackNotif.initStageMessage()
                            withCredentials([file(credentialsId: 'banco-ripley-app-dev', variable: 'GC_KEY')]) {
                                sh '''
                                set +x
                                export $(cat JenkinsParams)
                                gcloud config set project banco-ripley-app-dev
                                gcloud config set account devop-user@banco-ripley-app-dev.iam.gserviceaccount.com
                                gcloud auth activate-service-account devop-user@banco-ripley-app-dev.iam.gserviceaccount.com --key-file=${GC_KEY}
                                export GOOGLE_APPLICATION_CREDENTIALS=${GC_KEY}
                                export FIREBASE_TOKEN=$(gcloud auth application-default print-access-token)
                                npm run deploy-jenkins:dev
                                '''
                            }
                            slackNotif.updateStageMessage("DEPLOYING DEV")
                        }
                        // if ("${GIT_BRANCH}" == 'development') {
                        //     slackNotif.initStageMessage()
                        //     withCredentials([file(credentialsId: 'banco-ripley-app-dev', variable: 'GC_KEY')]) {
                        //         sh '''
                        //         set +x
                        //         export $(cat JenkinsParams)
                        //         gcloud config set project banco-ripley-app-dev
                        //         gcloud config set account devop-user@banco-ripley-app-dev.iam.gserviceaccount.com
                        //         gcloud auth activate-service-account devop-user@banco-ripley-app-dev.iam.gserviceaccount.com --key-file=${GC_KEY}
                        //         export GOOGLE_APPLICATION_CREDENTIALS=${GC_KEY}
                        //         export FIREBASE_TOKEN=$(gcloud auth application-default print-access-token)
                        //         npm run deploy-jenkins:dev
                        //         '''
                        //     }
                        //     slackNotif.updateStageMessage("DEPLOYING DEV")
                        // }
                        // else if ("${GIT_BRANCH}" == 'feature/jenkins-pipeline') {
                        //     //no hay pp por ahora, deploy dummy para probar dependencias
                        //     ENV="pp"
                        //     withCredentials([file(credentialsId: 'banco-ripley-app', variable: 'GC_KEY')]) {
                        //     sh '''
                        //         export $(cat JenkinsParams)
                        //         gcloud config set project banco-ripley-app
                        //         gcloud config set account devop-user@banco-ripley-app.iam.gserviceaccount.com
                        //         gcloud auth activate-service-account devop-user@banco-ripley-app.iam.gserviceaccount.com --key-file=${GC_KEY}
                        //         export GOOGLE_APPLICATION_CREDENTIALS=${GC_KEY}
                        //         export FIREBASE_TOKEN=$(gcloud auth application-default print-access-token)
                        //         npm run build:prod && firebase use banco-ripley-app
                        //         '''
                        //     }
                        // }
                        else if ("${GIT_BRANCH}" == 'master') {
                            slackNotif.initStageMessage()
                            withCredentials([file(credentialsId: 'banco-ripley-app', variable: 'GC_KEY')]) {
                                sh '''
                                export $(cat JenkinsParams)
                                gcloud config set project banco-ripley-app
                                gcloud config set account devop-user@banco-ripley-app.iam.gserviceaccount.com
                                gcloud auth activate-service-account devop-user@banco-ripley-app.iam.gserviceaccount.com --key-file=${GC_KEY}
                                export GOOGLE_APPLICATION_CREDENTIALS=${GC_KEY}
                                export FIREBASE_TOKEN=$(gcloud auth application-default print-access-token)
                                npm run deploy-jenkins:prod
                                '''
                            }
                            slackNotif.updateStageMessage("DEPLOYING PROD")
                        }
                    }
                }
            }
        }
    }
    post {
        always {
            script {
                slackNotif.sendFinalStatus()
                audit()
                cleanWs()
            }
        }
    }
}
