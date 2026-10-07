pipeline {
    agent any

    // Otomatis terpicu saat ada push ke repository
    triggers {
        githubPush()
    }

    environment {
        // AWS Region (dapat dioverride di Jenkins UI jika diperlukan)
        AWS_DEFAULT_REGION = "${env.AWS_DEFAULT_REGION ?: 'ap-southeast-1'}"
        AWS_REGION         = "${env.AWS_REGION ?: 'ap-southeast-1'}"

        // Mapping Environment Variables dari Jenkins UI (sesuai file .env)
        APP_PORT           = "${env.APP_PORT ?: '3630'}"
        NODE_ENV           = "${env.NODE_ENV ?: 'production'}"

        // PostgreSQL Config
        POSTGRES_USER      = "${env.POSTGRES_USER}"
        POSTGRES_PASSWORD  = "${env.POSTGRES_PASSWORD}"
        POSTGRES_DB        = "${env.POSTGRES_DB}"
        POSTGRES_PORT      = "${env.POSTGRES_PORT ?: '5434'}"

        // App Database Connection
        DB_HOST            = "${env.DB_HOST}"
        DB_PORT            = "${env.DB_PORT ?: '5432'}"
        DB_USER            = "${env.DB_USER}"
        DB_PASSWORD        = "${env.DB_PASSWORD}"
        DB_NAME            = "${env.DB_NAME}"

        // RabbitMQ Config
        RABBITMQ_HOST      = "${env.RABBITMQ_HOST}"
        RABBITMQ_PORT      = "${env.RABBITMQ_PORT ?: '5672'}"
        RABBITMQ_USER      = "${env.RABBITMQ_USER}"
        RABBITMQ_PASSWORD  = "${env.RABBITMQ_PASSWORD}"

        // Security & JWT Tokens
        REGISTER_TOKEN     = "${env.REGISTER_TOKEN}"
        ACCESS_TOKEN       = "${env.ACCESS_TOKEN}"
        REFRESH_TOKEN      = "${env.REFRESH_TOKEN}"
        BCRYPT_SALT_ROUNDS = "${env.BCRYPT_SALT_ROUNDS ?: '12'}"
    }

    stages {
        stage('🔍 Filter Branch prod') {
            steps {
                script {
                    def currentBranch = env.BRANCH_NAME ?: env.GIT_BRANCH ?: ''
                    echo "Checking branch: ${currentBranch}"
                    // Memastikan alur hanya berjalan pada branch prod
                    if (currentBranch != '' && !currentBranch.endsWith('prod')) {
                        currentBuild.result = 'ABORTED'
                        error("Pipeline dibatalkan: Push bukan pada branch prod (Current branch: ${currentBranch}).")
                    }
                }
            }
        }

        stage('📝 Generate .env File') {
            steps {
                echo "Menyiapkan file .env dari environment variable Jenkins UI..."
                sh """
cat << 'EOF' > .env
# Application Config
APP_PORT=${APP_PORT}
NODE_ENV=${NODE_ENV}

# Database Configuration (PostgreSQL Container)
POSTGRES_USER=${POSTGRES_USER}
POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
POSTGRES_DB=${POSTGRES_DB}
POSTGRES_PORT=${POSTGRES_PORT}

# App Connection to DB Container
DB_HOST=${DB_HOST}
DB_PORT=${DB_PORT}
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
DB_NAME=${DB_NAME}

# RabbitMQ Config
RABBITMQ_HOST=${RABBITMQ_HOST}
RABBITMQ_PORT=${RABBITMQ_PORT}
RABBITMQ_USER=${RABBITMQ_USER}
RABBITMQ_PASSWORD=${RABBITMQ_PASSWORD}

# JWT Tokens
REGISTER_TOKEN=${REGISTER_TOKEN}
ACCESS_TOKEN=${ACCESS_TOKEN}
REFRESH_TOKEN=${REFRESH_TOKEN}
BCRYPT_SALT_ROUNDS=${BCRYPT_SALT_ROUNDS}
EOF
"""
                sh "chmod 600 .env"
                echo "✅ File .env berhasil dibuat."
            }
        }

        stage('🔧 Terraform Init') {
            steps {
                echo "Inisialisasi Terraform..."
                sh "terraform init -no-color"
            }
        }

        stage('🔍 Terraform Validate') {
            steps {
                echo "Memvalidasi syntax Terraform..."
                sh "terraform validate -no-color"
            }
        }

        stage('📋 Terraform Plan') {
            steps {
                echo "Menyiapkan rencana deployment Terraform..."
                sh "terraform plan -out=tfplan -no-color"
            }
        }

        stage('🚀 Terraform Apply (Deploy ke AWS)') {
            steps {
                echo "Menjalankan deployment Terraform ke AWS..."
                sh "terraform apply -auto-approve tfplan -no-color"
            }
        }
    }

    post {
        always {
            sh "rm -f tfplan || true"
        }
        success {
            echo "=================================================="
            echo "🎉 Deployment be-geosandbox-user-service ke AWS Berhasil!"
            echo "=================================================="
            sh "terraform output || true"
        }
        failure {
            echo "=================================================="
            echo "❌ Deployment Gagal! Silakan periksa log console."
            echo "=================================================="
        }
    }
}
