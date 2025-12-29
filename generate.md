Act as a Senior Frontend Developer expert in Nuxt 3, Vue.js, Tailwind CSS, and daisyUI.

Please build a "Water Meter Recording System" (Thai Context) single-page application.

**Tech Stack:**

1.  **Framework:** Nuxt 3 (using Composition API with `<script setup>`).
2.  **Styling:** Tailwind CSS + daisyUI (for UI components).
3.  **Icons:** Use `lucide-vue-next` or Heroicons.
4.  **Data Persistence:** Use `localStorage` to save data on the client side. The data must persist after a page refresh.

**Project Requirements:**

1.  **Language & Localization:**

    - The entire UI must be in **Thai Language (ภาษาไทย)**.
    - Currency format: THB (e.g., ฿1,250.00).
    - Date format: Thai month/year (e.g., มกราคม 2567).

2.  **Core Features:**

    - **Dashboard (Stats):** Show a summary card at the top displaying "Total Units Used" and "Total Cost" (All time).
    - **Input Form:** A clean form to add a new record.
      - Month/Year (Select).
      - Previous Meter Reading (เลขมิเตอร์ครั้งก่อน).
      - Current Meter Reading (เลขมิเตอร์ครั้งนี้).
      - Price per Unit (default to 18, editable).
      - _Smart Logic:_ When opening the form, try to auto-fill the "Previous Meter Reading" based on the "Current Meter Reading" of the most recent record.
    - **Calculation:** Automatically calculate:
      - Units Used = Current - Previous.
      - Total Price = Units Used \* Price per Unit.
      - _Validation:_ Show an error if Current < Previous.
    - **History List:** Display saved records in a responsive table or card layout (Mobile-first). Include a "Delete" button for each record.

3.  **UI/UX Design:**
    - **Mobile-First:** The design must look perfect on mobile screens (since meters are checked on the go).
    - **Theme:** Use a clean, light theme suitable for utility apps.

**Deliverables:**
Please provide the complete code for:

1.  `nuxt.config.ts` (Configuration including Tailwind/daisyUI setup).
2.  `tailwind.config.js` (If necessary).
3.  `app.vue` (The main application logic and UI containing everything).

**Note:** Ensure the code is production-ready, clean, and includes comments explaining the logic.
