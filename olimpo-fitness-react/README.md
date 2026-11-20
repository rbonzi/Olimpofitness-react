# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Olimpo Fitness - Guía de Ejecución Local

## 1. Requisitos previos
- Tener instalado Java 17 o superior, Node.js 18 o superior y MySQL / MariaDB (XAMPP) encendido en el puerto `3306`.

## 2. Crear la base de datos de Usuarios
Ejecutar esta línea en MySQL Workbench o phpMyAdmin (la base de datos de Reservas se crea automáticamente al iniciar el servicio):
```sql
CREATE DATABASE IF NOT EXISTS olimpo_usuarios CHARACTER SET utf8mb4;