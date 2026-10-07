pipeline {
    agent any

    triggers {
        githubPush()
    }

    environment {
        // AWS Region (digunakan saat deployment production ke AWS)
        AWS_DEFAULT_REGION = "${env.AWS_DEFAULT_REGION ?: 'ap-southeast-1'}"
        AWS_REGION         = "${env.AWS_REGION ?: 'ap-southeast-1'}"
    }

    stages {
        stage('🔍 Check Branch') {
            steps {
                script {
                    def currentBranch = env.BRANCH_NAME ?: env.GIT_BRANCH ?: ''
                    echo "📌 Current Branch: ${currentBranch}"
                }
            }
        }

        stage('📥 Load Environment (.env)') {
            when {
                expression {
                    def branch = env.BRANCH_NAME ?: env.GIT_BRANCH ?: ''
                    return branch.contains('development') || branch.contains('dev') ||
                           branch.contains('production') || branch.contains('prod')
                }
            }
            steps {
                echo "Mengambil konfigurasi .env dari Jenkins Credentials (ID: ENV-USER-SERVICE-GEOSANDBOX)..."
                withCredentials([file(credentialsId: 'ENV-USER-SERVICE-GEOSANDBOX', variable: 'SECRET_ENV_FILE')]) {
                    sh '''
                        cp "$SECRET_ENV_FILE" .env
                        chmod 600 .env
                        echo "✅ File .env berhasil disalin dari credentials Jenkins."
                    '''
                }
            }
        }

        // =====================================================================
        // STAGE 1: DEVELOPMENT (Deploy ke Docker Container Lokal via main-dev.tf)
        // =====================================================================
        stage('🐳 Deploy Development (Local Docker)') {
            when {
                expression {
                    def branch = env.BRANCH_NAME ?: env.GIT_BRANCH ?: ''
                    return branch.contains('development') || branch.contains('dev')
                }
            }
            steps {
                echo "🚀 Menjalankan deployment DEVELOPMENT ke Docker Container Lokal via main-dev.tf..."
                sh '''
                    # Sembunyikan main-prod.tf (AWS) sementara agar Terraform hanya mengeksekusi main-dev.tf
                    if [ -f "main-prod.tf" ]; then
                        mv main-prod.tf main-prod.tf.bak
                    fi

                    terraform init -no-color
                    terraform validate -no-color
                    terraform plan -out=tfplan -no-color
                    terraform apply -auto-approve tfplan -no-color
                '''
            }
            post {
                always {
                    sh '''
                        rm -f tfplan || true
                        if [ -f "main-prod.tf.bak" ]; then
                            mv main-prod.tf.bak main-prod.tf
                        fi
                    '''
                }
                success {
                    echo "🎉 Deployment DEVELOPMENT Berhasil! Container user_service_app aktif di Docker lokal."
                }
            }
        }

        // =====================================================================
        // STAGE 2: PRODUCTION (Deploy ke AWS EC2 via main-prod.tf)
        // =====================================================================
        stage('☁️ Deploy Production (AWS EC2)') {
            when {
                expression {
                    def branch = env.BRANCH_NAME ?: env.GIT_BRANCH ?: ''
                    return branch.contains('production') || branch.contains('prod')
                }
            }
            steps {
                echo "🚀 Menjalankan deployment PRODUCTION ke AWS via main-prod.tf..."
                sh '''
                    # Sembunyikan main-dev.tf sementara agar Terraform hanya mengeksekusi main-prod.tf
                    if [ -f "main-dev.tf" ]; then
                        mv main-dev.tf main-dev.tf.bak
                    fi

                    terraform init -no-color
                    terraform validate -no-color
                    terraform plan -out=tfplan -no-color
                    terraform apply -auto-approve tfplan -no-color
                '''
            }
            post {
                always {
                    sh '''
                        rm -f tfplan || true
                        if [ -f "main-dev.tf.bak" ]; then
                            mv main-dev.tf.bak main-dev.tf
                        fi
                    '''
                }
                success {
                    echo "🎉 Deployment PRODUCTION Berhasil! Instance EC2 AWS telah aktif."
                    sh "terraform output || true"
                }
            }
        }
    }

    post {
        always {
            sh '''
                # Pastikan kedua file kembali ke nama semula jika pipeline terhenti
                if [ -f "main-prod.tf.bak" ]; then mv main-prod.tf.bak main-prod.tf; fi
                if [ -f "main-dev.tf.bak" ]; then mv main-dev.tf.bak main-dev.tf; fi
            '''
        }
        failure {
            echo "❌ Pipeline Gagal! Silakan cek log console di atas."
        }
    }
}
