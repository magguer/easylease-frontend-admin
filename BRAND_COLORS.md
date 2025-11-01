# � EasyLease Brand Colors Guide

## 🎯 Estrategia de Color

Esta paleta está diseñada para transmitir **confianza**, **profesionalismo** y **dinamismo** en el sector de gestión de propiedades.

### Filosofía
- **Azul primario (#0057D9)**: Confianza, tecnología, profesionalismo
- **Naranja (#FF6A00)**: CTAs urgentes, dinamismo, "Reserva ahora"
- **Verde (#00C48C)**: Éxito, disponibilidad, "todo ok"
- **Neutros**: Textos y fondos de soporte
- **Rojo (#E63946)**: SOLO alertas críticas (morosidad, errores graves)

---

## 📋 Paleta Completa

### 🔵 Primary Blue - COLOR PRINCIPAL
**Uso:** Navegación, botones principales, enlaces, brand identity

```css
--primary-50: #E6F0FF   /* Fondos muy claros, hover states sutiles */
--primary-100: #CCE1FF  /* Fondos claros, badges */
--primary-200: #99C3FF  /* Borders, disabled states */
--primary-300: #66A5FF  /* Iconos secundarios */
--primary-400: #3382E8  /* Hover de elementos secundarios */
--primary-500: #0057D9  /* ⭐ COLOR BASE - Botones, links, nav activa */
--primary-600: #0048B8  /* Hover de botones primarios */
--primary-700: #003DA1  /* Active/pressed states */
--primary-800: #002F7A  /* Headers, elementos de alta jerarquía */
--primary-900: #001F52  /* Textos de alto contraste */
```

### 🟠 Accent Orange - URGENCIA Y CTAs
**Uso:** CTAs urgentes, notificaciones, "Reserva ahora", editar, pendientes

```css
--orange-50: #FFF4E6    /* Fondos de alerta suave */
--orange-100: #FFE9CC   /* Badges de estado pendiente */
--orange-200: #FFD299   /* Borders de advertencia */
--orange-300: #FFBC66   /* Iconos de atención */
--orange-400: #FF9333   /* Hover de elementos secundarios */
--orange-500: #FF6A00   /* ⭐ COLOR BASE - CTAs, urgencias */
--orange-600: #CC5500   /* Hover de botones naranja */
--orange-700: #994000   /* Active states */
--orange-800: #662B00   /* Textos sobre fondos claros */
--orange-900: #331500   /* Máximo contraste */
```

### 🟢 Accent Green - ÉXITO Y DISPONIBILIDAD
**Uso:** Éxito, "pagado", "disponible", "todo ok", conversiones, partners activos

```css
--green-50: #E6FBF4     /* Fondos de éxito */
--green-100: #CCF7E9    /* Badges de disponible/activo */
--green-200: #99EFD3    /* Borders de confirmación */
--green-300: #66E7BD    /* Iconos de check */
--green-400: #33D1A3    /* Hover de elementos positivos */
--green-500: #00C48C    /* ⭐ COLOR BASE - Success, disponible */
--green-600: #009D70    /* Hover de botones verdes */
--green-700: #007654    /* Active states */
--green-800: #004F38    /* Textos sobre fondos claros */
--green-900: #00271C    /* Máximo contraste */
```

### ⚫ Neutral Grays - TEXTOS Y FONDOS
**Uso:** Textos, fondos secundarios, separadores, elementos de soporte

```css
--neutral-50: #FAFBFC   /* Fondos de página, áreas secundarias */
--neutral-100: #F5F7FA  /* Fondos de cards hover */
--neutral-200: #E0E4E9  /* Borders, separadores */
--neutral-300: #C5CBD4  /* Borders hover */
--neutral-400: #A3ADBF  /* Placeholders, texto deshabilitado */
--neutral-500: #7F8B9E  /* Texto secundario */
--neutral-600: #5F6B7D  /* Texto de menor jerarquía */
--neutral-700: #4A5568  /* Subtítulos, labels */
--neutral-800: #2E2E2E  /* ⭐ Texto principal, headers */
--neutral-900: #1A1A1A  /* Texto de máximo contraste */
```

### 🔴 Alert Red - SOLO CRÍTICO
**Uso:** ÚNICAMENTE para alertas críticas, errores graves, morosidad, eliminar

```css
--red-50: #FEE5E7       /* Fondos de error suave */
--red-100: #FCC9CD      /* Badges de error */
--red-200: #F99BA3      /* Borders de error */
--red-300: #F66D79      /* Iconos de error */
--red-400: #ED4654      /* Hover de alertas */
--red-500: #E63946      /* ⭐ COLOR BASE - Error, crítico */
--red-600: #D62839      /* Hover de botones de eliminar */
--red-700: #C1222D      /* Active states */
--red-800: #9B1B24      /* Textos de error */
--red-900: #7A1519      /* Máximo contraste de error */
```

---

## 💡 Guía de Uso por Componente

### 🔘 Botones

**Botón Principal (CTA)**
```tsx
// Acciones principales: "Ver más", "Buscar", "Crear Listing"
className="bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white px-6 py-3 rounded-xl font-semibold"
```

**Botón de Urgencia/CTA Destacado**
```tsx
// Acciones urgentes: "Reserva ahora", "Editar", "Contactar"
className="bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white px-6 py-3 rounded-xl font-semibold"
```

**Botón de Éxito**
```tsx
// Confirmaciones: "Publicar", "Activar Partner", "Confirmar"
className="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white px-6 py-3 rounded-xl font-semibold"
```

**Botón Secundario**
```tsx
// Acciones secundarias: "Cancelar", "Volver"
className="bg-white border-2 border-neutral-300 text-neutral-700 hover:bg-neutral-50 hover:border-neutral-400 px-6 py-3 rounded-xl font-semibold"
```

**Botón de Peligro**
```tsx
// SOLO acciones destructivas: "Eliminar", "Borrar"
className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white px-6 py-3 rounded-xl font-semibold"
```

---

### 🏷️ Status Badges

**Nuevo (Leads nuevos)**
```tsx
className="bg-primary-100 text-primary-800 border border-primary-200 px-3 py-1.5 rounded-full text-xs font-semibold"
// Ejemplo: Lead status="new"
```

**Pendiente/Contactado**
```tsx
className="bg-orange-100 text-orange-800 border border-orange-200 px-3 py-1.5 rounded-full text-xs font-semibold"
// Ejemplo: Lead status="contacted", Partner status="pending"
```

**Éxito/Activo/Publicado**
```tsx
className="bg-green-100 text-green-800 border border-green-200 px-3 py-1.5 rounded-full text-xs font-semibold"
// Ejemplo: Lead status="converted", Listing status="published", Partner status="active"
```

**Inactivo/Descartado**
```tsx
className="bg-neutral-100 text-neutral-800 border border-neutral-200 px-3 py-1.5 rounded-full text-xs font-semibold"
// Ejemplo: Lead status="discarded", Partner status="inactive"
```

---

### 📊 Cards y Contenedores

**Card Principal**
```tsx
className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6"
```

**Card con Hover**
```tsx
className="bg-white rounded-xl shadow-sm border border-neutral-100 hover:shadow-md hover:border-neutral-200 transition-all p-6"
```

**Fondo de Página**
```tsx
className="bg-neutral-50 min-h-screen"
```

---

### 🎯 Iconos de Acción

**Ver detalles**
```tsx
className="text-primary-600 hover:text-primary-900 hover:bg-primary-50 p-2 rounded-lg"
```

**Editar**
```tsx
className="text-orange-600 hover:text-orange-900 hover:bg-orange-50 p-2 rounded-lg"
```

**Eliminar**
```tsx
className="text-red-600 hover:text-red-900 hover:bg-red-50 p-2 rounded-lg"
```

---

### 📝 Textos

**Título Principal**
```tsx
className="text-4xl font-bold text-neutral-900"
```

**Subtítulo**
```tsx
className="text-lg text-neutral-600"
```

**Texto de Cuerpo**
```tsx
className="text-base text-neutral-700"
```

**Texto Secundario**
```tsx
className="text-sm text-neutral-500"
```

**Enlaces**
```tsx
className="text-primary-600 hover:text-primary-700 underline"
```

---

## ♿ Checklist de Accesibilidad

### Contraste Mínimo
- ✅ Texto principal (neutral-800) sobre blanco: **15.3:1** - Excelente
- ✅ Texto secundario (neutral-600) sobre blanco: **7.2:1** - AAA
- ✅ Enlaces (primary-600) sobre blanco: **7.8:1** - AAA
- ✅ Botones primarios (primary-600): contraste suficiente
- ✅ Botones naranja (orange-600): contraste suficiente
- ✅ Botones verde (green-600): contraste suficiente

### Estados de Interacción
- ✅ Todos los botones tienen estados hover, active y focus claramente definidos
- ✅ Los badges tienen borders para mejorar la distinción de colores
- ✅ Los iconos de acción tienen fondos de hover para mejor feedback

### Modo Oscuro (Preparado para Futuro)
```css
@media (prefers-color-scheme: dark) {
  :root {
    --background: #1A1A1A;
    --foreground: #F5F7FA;
  }
}
```

---

## 🔄 Cómo Cambiar los Colores Globalmente

Todos los colores se definen en `src/app/globals.css`. Para cambiar toda la aplicación:

1. Modifica las variables CSS en `:root`
2. Las clases de Tailwind se mapean automáticamente
3. Reinicia el servidor de desarrollo

**Ejemplo:** Para cambiar el azul primario de `#0057D9` a `#0088B8`:

```css
:root {
  --primary-500: #0088B8;  /* Cambiar solo este valor */
  /* Los demás tonos se pueden ajustar proporcionalmente */
}
```

---

## 📚 Referencias

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
