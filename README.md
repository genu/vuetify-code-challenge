# Vuetify Blog Challenge

A blog application built with Vue and Vuetify as part of the Vuetify Developer Code Challenge. This application provides a complete CRUD system for managing blog posts.

> [!IMPORTANT]
> This is a local-only design that uses IndexedDB (via IDB) for data persistence, eliminating the need for a backend server while still maintaining state through page refreshes.

> [!NOTE]
> Some of the dialog logic is inspired by my previous work here: [github.com/nuxt/ui/pull/3279](https://github.com/nuxt/ui/pull/3279)

## 🚀 Features

- **CRUD Operations**:

  - Create new blog posts
  - Read and display all blog posts
  - Update existing blog posts
  - Delete blog posts

- **Data Persistence**:
  - Uses IndexedDB via `idb`
  - All data persists through page refreshes

## 📋 Installation and Setup

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/genu/vuetify-code-challenge
   cd vuetify-blog-challenge
   bun install
   ```

## 📑 License

[MIT](http://opensource.org/licenses/MIT)
