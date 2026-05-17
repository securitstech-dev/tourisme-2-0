# Design System: Congo Tourisme (Stitch-Inspired V2)

**Project Identity:** Plateforme SaaS de tourisme national (République du Congo)
**Owner:** Securits Tech
**Design Philosophy:** "The Lush Professional" - Un mélange entre l'élégance technologique moderne et la richesse organique de la nature congolaise.

## 1. Visual Theme & Atmosphere

L'atmosphère évolue vers le **Luxe Organique**. Le design utilise des effets de **profondeur (layers)**, du **glassmorphism** pour évoquer la clarté et la modernité, et des **mouvements fluides** qui rappellent le cours du fleuve Congo.
- **Vibe:** Sophistiqué, Aéré, Immersif, Confiant.
- **Depth:** Utilisation de flous d'arrière-plan (backdrop-blur) pour superposer les informations sans encombrer la vue.

## 2. Color Palette & Roles

| Nom Sémantique | Hex Code | Rôle Fonctionnel |
| :--- | :--- | :--- |
| **Deep Forest** | `#1A6B4A` | Couleur principale : Branding, boutons primaires. |
| **Mayombe Emerald** | `#2D8C64` | Gradient / Accent : Nuance plus vive pour le relief. |
| **Golden Savannah** | `#C8860A` | Couleur secondaire : Appels à l'action, badges premium. |
| **Mist White** | `#FAFAF8` | Fond principal : Ultra-propre, presque blanc. |
| **Glass Overlay** | `rgba(255,255,255,0.7)` | Surfaces interactives avec flou (`blur(12px)`). |
| **Obsidian** | `#1A1A1A` | Texte haute fidélité. |

## 3. Typography Rules

- **Display:** `Inter` avec un espacement serré (`-0.04em`) pour les grands titres.
- **Body:** `Inter` avec un interlignage généreux (`leading-relaxed`) pour une lecture confortable.
- **Accent:** Utilisation occasionnelle de l'italique pour les citations ou sous-titres évocateurs.

## 4. Component Stylings (The Stitch Way)

- **Buttons:**
  - **Premium Primary:** Gradient de `Deep Forest` à `Mayombe Emerald`, ombre portée douce, radius `16px`.
  - **Glass Secondary:** Fond blanc semi-transparent, bordure fine `1px`, effet de flou.
- **Cards (StitchCards):**
  - **Structure:** Radius `24px` pour un look plus "mobile-first" et moderne.
  - **Visuals:** Bordures subtiles, ombres diffuses multi-niveaux.
  - **Hover:** Légère élévation, changement de saturation de l'image.
- **Navigation:**
  - **Floating Navbar:** Position fixe, fond "glassy", transitions au scroll.

## 5. Layout & Motion Principles

- **Asymmetry:** Placement décalé des images et du texte pour créer un rythme visuel dynamique.
- **Reveal Animations:** Utilisation de `framer-motion` pour des entrées en scène progressives (staggered entries).
- **Parallax:** Effets de profondeur légers lors du défilement.

