module.exports = {
  apps: [
    {
      name: "backend",
      script: "npm",
      args: "run start:backend", // Используем твой готовый скрипт
      cwd: "./", // Работаем из корня
      instances: 1,
      autorestart: true,
      watch: false,
    },
    {
      name: "frontend",
      script: "npm",
      args: "run start:frontend", // Используем твой готовый скрипт
      cwd: "./", // Работаем из корня
      instances: 1,
      autorestart: true,
      watch: false,
    },
  ],
}
