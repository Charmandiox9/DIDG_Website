# DIDG_Website

# 🚀 DIDG System - Plataforma de Gestión Académica

Plataforma integral para la gestión de recursos académicos, ayudantías y herramientas para estudiantes de ingeniería. Desarrollada con arquitectura moderna, enfoque en UX y seguridad robusta.

| Vista Escritorio | Vista Móvil |
| :---: | :---: |
| <img src="/didg-website/public/www.danielduran.engineer_ web.png" alt="Desktop" width="600"/> | <img src="/didg-website/public/www.danielduran.engineer_movil.png" alt="Mobile" width="200"/> |

## 🛠 Tech Stack

* **Core:** Next.js 14 (App Router), TypeScript, React.
* **Estilos:** Tailwind CSS, Shadcn/ui, Framer Motion (Animaciones).
* **Backend & DB:** Supabase (PostgreSQL, Auth, RLS).
* **Integraciones:** Telegram Bot API (Notificaciones en tiempo real).
* **Gestión de Estado:** Context API + Server Actions.

## ✨ Funcionalidades Clave

### 🔐 Seguridad y Autenticación
* Sistema de Login con **Supabase Auth**.
* **2FA (Doble Factor)** para acciones administrativas vía Telegram.
* Protección de rutas con **Middleware** y **Row Level Security (RLS)** en base de datos.

### 🎓 Gestión Académica
* **Timeline de Ayudantías:** Vista cronológica de clases pasadas y futuras.
* **Biblioteca de Recursos:** Filtrado por etiquetas y asignaturas.
* **Sistema de Favoritos (Bookmarks):** Los estudiantes pueden guardar recursos en su perfil.

### 🛠 Herramientas y Utilidades
* **Simulador de Notas:** Calculadora Client-Side con persistencia local.
* **Terminal de Comandos (Ctrl+K):** Navegación rápida estilo "CmdK".
* **Modo Zen:** Interfaz limpia ocultable para dispositivos móviles.

### 🎨 UI/UX
* **Tema Dinámico:** Soporte nativo Dark/Light mode.
* **Mascota Virtual (Charmander):** Componente interactivo reactivo al scroll y actividad (AFK).
* **Diseño Responsive:** Optimizado para móviles con menús flotantes adaptables.

## 🚀 Instalación Local

1.  Clonar el repositorio:
    ```bash
    git clone [https://github.com/tu-usuario/didg-system.git](https://github.com/tu-usuario/didg-system.git)
    ```
2.  Instalar dependencias:
    ```bash
    npm install
    ```
3.  Configurar variables de entorno (`.env.local`):
    ```env
    NEXT_PUBLIC_SUPABASE_URL=...
    NEXT_PUBLIC_SUPABASE_ANON_KEY=...
    TELEGRAM_BOT_TOKEN=...
    TELEGRAM_CHAT_ID=...
    ```
4.  Correr el servidor:
    ```bash
    npm run dev
    ```