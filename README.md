# 🤖 Messi Perfect Shots 2.0

Este proyecto es una reversión de mi proyecto bot de X/Twitter llamado **"Messi Perfect Shots"**, ahora reescrito en TypeScript y completamente automatizado en la nube usando Cloudinary y GitHub Actions.

## ⚽ ¿Qué es Messi Perfect Shots?

Messi Perfect Shots es un **bot de X/Twitter** dedicado a publicar fotos de Lionel Messi todos los días, de forma automática y aleatoria. Empezó en abril de 2024 como un proyecto en JavaScript ejecutado localmente con el Programador de Tareas de Windows, y logró más de **4.000 seguidores en un año**, con más de **650 publicaciones** al día de hoy. 

👉 Link: [Messi Perfect Shots](https://x.com/MessiPF)

![image](https://github.com/user-attachments/assets/588dc1ff-20c4-4b82-80fe-f7c057d70754)

## 🔍 ¿Qué cambió en esta nueva versión?

Esta nueva versión 2.0 representa una migración a tecnologías más sostenibles, y prácticas más eficientes:

| Característica       | Antes (JavaScript y local)                            | Ahora (TypeScript y en la nube)                       |
|----------------------|-------------------------------------------------------|-------------------------------------------------------|
| ✍ Lenguaje          | JavaScript                                            | TypeScript y YAML                                     |
| 🚀 Ejecución         | Programador de Tareas (local)                         | GitHub Actions (cloud, 100% automatizado)             |
| 📷 Imágenes          | Carpeta local en mi sistema                           | Cloudinary (almacenamiento en la nube)                |
| 🤖 Funcionamiento    | Máquina encendida y conexión a Internet               | Se ejecuta solo desde GitHub                          |
| 🔺 Escalabilidad     | Limitada a herramientas locales                       | Más flexible con GitHub Actions y Cloudinary          |

## ⚙️ ¿Cómo funciona?

1. **Selección aleatoria**: El bot elige una imagen aleatoria desde un repositorio en Cloudinary.
2. **Publicación automática**: La imagen se publica en la cuenta de X/Twitter conectada: [@MessiPF](https://x.com/MessiPF).
3. **Evita repeticiones**: Una vez publicada, la imagen es renombrada en Cloudinary con un prefijo (`Posted-`) para evitar volver a usarla.
4. **Automatización diaria**: Gracias a GitHub Actions, el bot se ejecuta automáticamente todos los días a las **17:00 y 21:00 hora Argentina**.

## 🧪 Tecnologías usadas

- [TypeScript](https://www.typescriptlang.org/)
- [Twitter API v2 (twitter-api-v2)](https://github.com/PLhery/node-twitter-api-v2)
- [Cloudinary](https://cloudinary.com/)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [GitHub Actions](https://docs.github.com/es/actions)

## 🚀 ¿Cómo puedo hacer el mío?

1. Clonar el proyecto y ejecutar `npm install` para instalar las dependencias.
2. Crear y completar un archivo `.env` con las variables de entorno necesarias:

   ```env
   # Claves para vincularse a la cuenta de X/Twitter
   TWITTER_API_KEY=""
   TWITTER_API_SECRET=""
   TWITTER_ACCESS_TOKEN=""
   TWITTER_ACCESS_SECRET=""

   # Claves para vincularse a la cuenta de Cloudinary
   CLOUD_NAME=""
   CLOUDINARY_API_KEY=""
   CLOUDINARY_API_SECRET=""
   ```

- Para obtener las **credenciales de X/Twitter**, hay que entrar a [X Developer Platform](https://developer.x.com/en) y crear un proyecto vinculado a alguna cuenta de X/Twitter existente. Y no olvidarse de configurar permisos de escritura y no solo lectura.
- Para obtener las **credenciales de Cloudinary**, simplemente hay que registrarnos en [Cloudinary](https://cloudinary.com/) e iniciar sesión.

3. Crear y guardar cada una de estas claves en GitHub Secrets. Esto se configura en:

```
  [Tu repositorio ya creado] > Settings > Secrets and variables > Actions
```

5. Ejecutar `npx tsc○` para compilar el proyecto.

6. Finalmente, ejecutar `node dist/main.js` para hacer una prueba manual.

## 📅 Automatización con GitHub Actions

El archivo `post-image.yml` que está en la carpeta `.github/workflows/` se usa para definir cuándo se va a ejecutar el bot y qué pasos va a realizar. En este caso, el proceso se hace todos los días a las:

- 🕔 17:00 (Argentina) → "0 20 * * *" UTC
- 🕘 21:00 (Argentina) → "0 0 * * *" UTC

También se puede ejecutar el flujo manualmente desde la **pestaña de Actions en GitHub**. Obviamente, uno puede modificar esta parte (el on-schedule) a su antojo, para especificar cuándo se tiene que ejecutar el proceso del bot.

## 📂 Sobre el Proyecto anterior

Como aclaré al principio, este proyecto es una reescritura de mi bot anterior hecho en JavaScript, el cual utilizaba carpetas locales y el Programador de Tareas de Windows. Si te interesa ver cómo funcionaba esa versión, podés revisarla en su repositorio: [Antiguo Proyecto](https://github.com/Leumig/mps-version-anterior). Aunque lo ideal sería hacerlo como vimos recién.

## 📫 Contacto

Si tenés preguntas, ideas o querés crear tu propio bot, podés escribirme en: junmigue7@gmail.com
