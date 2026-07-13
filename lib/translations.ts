export type Locale = "en" | "es";

export const translations: Record<Locale, Record<string, string>> = {
  en: {
    // Nav
    "nav.home": "Home",
    "nav.menu": "Menu",
    "nav.faqs": "FAQs",
    "nav.contact": "Contact",
    "nav.orderNow": "Order Now",
    "nav.toggleMenu": "Toggle navigation menu",
    "nav.switchTo": "Español",

    // Hero
    "hero.orderHere": "Order here",
    "hero.pickup": "Pickup & delivery",

    // Signatures
    "sig.eyebrow": "SIGNATURES",
    "sig.heading": "What the kitchen is known for.",
    "sig.subheading": "Six plates we're known for — pulled straight from the carta.",
    "sig.plate1.name": "Grilled Meat",
    "sig.plate1.desc": "Grilled meat, chorizo, sausage, onions, rice and beans.",
    "sig.plate2.name": "Grilled Steak",
    "sig.plate2.desc": "Grilled marinated beef served with rice, beans and salad.",
    "sig.plate3.name": "BBQ Pork Ribs",
    "sig.plate3.desc": "BBQ pork ribs served with rice, beans and salad.",
    "sig.plate4.name": "BBQ Chicken Wings",
    "sig.plate4.desc": "BBQ chicken wings served with rice, beans and salad.",
    "sig.plate5.name": "Guatemalan Breakfast",
    "sig.plate5.desc":
      "Eggs, beans, cheese, plantains, toast and cream — the full Guatemalan breakfast.",
    "sig.plate6.name": "Mayan Chicken Stew",
    "sig.plate6.desc": "Rich Mayan seed-and-chile sauce over chicken or beef, served with rice.",
    "sig.viewFull": "View the full menu",

    // PromoBanner
    "promo.badge": "LIMITED TIME",
    "promo.heading": "The Sopa de Gallina Is Back",
    "promo.body":
      "Hearty traditional hen soup — slow-simmered with garden vegetables, herbs, and lime. A daily special.",
    "promo.cta": "Order Now",

    // FAQs
    "faq.eyebrow": "GOT QUESTIONS?",
    "faq.heading": "We've got answers.",
    "faq.intro":
      "Everything you might want to know before you order. Anything else, give us a call — the phone rings straight to the pass.",
    "faq.q1": "Do you take walk-ins?",
    "faq.a1":
      "Yes — walk in any time we're open, or order ahead through the site for pickup or delivery. Whichever gets you fed faster.",
    "faq.q2": "Are the tamales made in-house?",
    "faq.a2":
      "Every morning, by hand, from fresh masa. Tamales de elote, chuchitos, and tamales de masa — when we run out, we're out.",
    "faq.q3": "Vegetarian and gluten-free options?",
    "faq.a3":
      "Plenty. Vegetarian dishes are marked with a leaf on the menu. Tamales de elote and rellenitos are naturally gluten-free — ask us and we'll flag anything that isn't.",
    "faq.q4": "How spicy are the salsas?",
    "faq.a4":
      "Three: a mild verde, a medium roja, and a chapín that means business. All hechas en casa.",
    "faq.q5": "Do you cater larger orders?",
    "faq.a5":
      "Yes. Give us 48 hours' notice for anything over twenty people and we'll build a spread — parrillada, tamales, chuchitos, and salsas by the pint.",
    "faq.q6": "What are your hours?",
    "faq.a6":
      "Tuesday through Sunday, 11am to 9pm. Closed Mondays so the team can rest and prep for the week.",

    // Footer
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms & Conditions",
    "footer.tagline": "Real Guatemalan, fresh off the fire.",
    "footer.madeWith": "Hecho con cariño en",
    "footer.copyright": "© 2026 El Quetzalito ·",

    // Menu page
    "menuPage.eyebrow": "El Quetzalito",
    "menuPage.heading": "The Menu",
    "menuPage.body":
      "Guatemalan platters, breakfast served all day, antojitos, and traditional drinks — hecho con amor.",
    "menuPage.dailySpecials": "Daily Specials",

    // Cart
    "cart.title": "Cart",
    "cart.subtitle": "Review your order before checking out.",
    "cart.heading": "Your cart",
    "cart.clear": "Clear",
    "cart.loading": "Loading cart…",
    "cart.empty.title": "Your cart is empty",
    "cart.empty.subtitle": "Add some delicious items from the menu to get started.",
    "cart.empty.browse": "Browse menu",
    "cart.continue": "Continue ordering",
    "cart.checkout": "Proceed to checkout",
    "cart.item": "item",
    "cart.items": "items",

    // Checkout
    "checkout.title": "Checkout",
    "checkout.subtitle": "Review your order, choose pickup, and place it with us.",
    "checkout.contact.heading": "Contact",
    "checkout.contact.name": "Name",
    "checkout.contact.name.placeholder": "Your name",
    "checkout.contact.phone": "Phone",
    "checkout.contact.email": "Email",
    "checkout.pickup.heading": "Pickup",
    "checkout.pickup.asap": "ASAP",
    "checkout.pickup.asap.sub": "As soon as possible",
    "checkout.pickup.scheduled": "Scheduled",
    "checkout.pickup.scheduled.sub": "Choose a time",
    "checkout.pickup.time": "Pickup time",
    "checkout.pickup.select": "Select a pickup slot",
    "checkout.pickup.none": "No pickup slots are available right now.",
    "checkout.promo.heading": "Promo code",
    "checkout.promo.placeholder": "Enter code",
    "checkout.promo.apply": "Apply",
    "checkout.promo.trying": "Trying code:",
    "checkout.tip.heading": "Tip",
    "checkout.tip.custom": "Custom %",
    "checkout.tip.amount": "Tip amount:",
    "checkout.order.heading": "Review order",
    "checkout.order.loading": "Loading cart…",
    "checkout.order.empty": "Your cart is empty.",
    "checkout.order.subtotal": "Subtotal",
    "checkout.order.discount": "Discount",
    "checkout.order.tax": "Tax",
    "checkout.order.tip": "Tip",
    "checkout.order.total": "Total",
    "checkout.order.promo": "Promotion applied:",
    "checkout.submit": "Place order",
    "checkout.placing": "Placing order…",
    "checkout.fixErrors": "Please fix the errors before placing your order.",
  },
  es: {
    // Nav
    "nav.home": "Inicio",
    "nav.menu": "Menú",
    "nav.faqs": "Preguntas",
    "nav.contact": "Contacto",
    "nav.orderNow": "Ordenar",
    "nav.toggleMenu": "Alternar menú de navegación",
    "nav.switchTo": "English",

    // Hero
    "hero.orderHere": "Ordenar aquí",
    "hero.pickup": "Para llevar y entrega",

    // Signatures
    "sig.eyebrow": "ESPECIALIDADES",
    "sig.heading": "Lo que la cocina conoce.",
    "sig.subheading": "Seis platos por los que somos conocidos — directo de la carta.",
    "sig.plate1.name": "Churrasco Tikal",
    "sig.plate1.desc": "Carne a la parrilla, chorizo, salchicha, cebollines, arroz y frijoles.",
    "sig.plate2.name": "Carne Asada",
    "sig.plate2.desc": "Carne de res marinada a la parrilla con arroz, frijoles y ensalada.",
    "sig.plate3.name": "Costillas BBQ",
    "sig.plate3.desc": "Costillas BBQ de cerdo con arroz, frijoles y ensalada.",
    "sig.plate4.name": "Alitas BBQ",
    "sig.plate4.desc": "Alitas de pollo BBQ con arroz, frijoles y ensalada.",
    "sig.plate5.name": "Desayuno El Quetzalito",
    "sig.plate5.desc":
      "Huevos, frijoles, queso, plátanos, tostadas y crema — el desayuno guatemalteco completo.",
    "sig.plate6.name": "Pepián de Gallina o Res",
    "sig.plate6.desc": "Salsa maya de semillas y chile sobre pollo o res, servido con arroz.",
    "sig.viewFull": "Ver el menú completo",

    // PromoBanner
    "promo.badge": "TIEMPO LIMITADO",
    "promo.heading": "La Sopa de Gallina Ha Vuelto",
    "promo.body":
      "Caldo de gallina tradicional — cocido a fuego lento con verduras del huerto, hierbas y limón. Un especial del día.",
    "promo.cta": "Ordenar Ahora",

    // FAQs
    "faq.eyebrow": "¿TIENES PREGUNTAS?",
    "faq.heading": "Tenemos respuestas.",
    "faq.intro":
      "Todo lo que quieras saber antes de ordenar. Para cualquier otra cosa, llámanos — el teléfono suena directo a la cocina.",
    "faq.q1": "¿Aceptan clientes sin reservación?",
    "faq.a1":
      "Sí — entra cuando quieras durante el horario de atención, o haz tu pedido anticipado para llevar o entrega. Lo que te ayude a comer más rápido.",
    "faq.q2": "¿Los tamales son caseros?",
    "faq.a2":
      "Todas las mañanas, a mano, con masa fresca. Tamales de elote, chuchitos y tamales de masa — cuando se acaban, se acaban.",
    "faq.q3": "¿Opciones vegetarianas y sin gluten?",
    "faq.a3":
      "Muchas. Los platillos vegetarianos están marcados con una hoja en el menú. Los tamales de elote y rellenitos son naturalmente sin gluten — pregúntanos y te indicamos todo.",
    "faq.q4": "¿Qué tan picantes son las salsas?",
    "faq.a4":
      "Tres: una verde suave, una roja media, y una chapina que habla en serio. Todas hechas en casa.",
    "faq.q5": "¿Hacen pedidos para grupos grandes?",
    "faq.a5":
      "Sí. Avísanos con 48 horas de anticipación para más de veinte personas y armamos un festín — parrillada, tamales, chuchitos y salsas al litro.",
    "faq.q6": "¿Cuáles son los horarios?",
    "faq.a6":
      "Martes a domingo, 11am a 9pm. Los lunes cerramos para que el equipo descanse y prepare la semana.",

    // Footer
    "footer.privacy": "Política de Privacidad",
    "footer.terms": "Términos y Condiciones",
    "footer.tagline": "Guatemalteco real, recién del fuego.",
    "footer.madeWith": "Hecho con cariño en",
    "footer.copyright": "© 2026 El Quetzalito ·",

    // Menu page
    "menuPage.eyebrow": "El Quetzalito",
    "menuPage.heading": "El Menú",
    "menuPage.body":
      "Platillos guatemaltecos, desayuno todo el día, antojitos y bebidas tradicionales — hecho con amor.",
    "menuPage.dailySpecials": "Especiales del Día",

    // Cart
    "cart.title": "Carrito",
    "cart.subtitle": "Revisa tu pedido antes de pagar.",
    "cart.heading": "Tu carrito",
    "cart.clear": "Vaciar",
    "cart.loading": "Cargando carrito…",
    "cart.empty.title": "Tu carrito está vacío",
    "cart.empty.subtitle": "Agrega platillos deliciosos del menú para empezar.",
    "cart.empty.browse": "Ver menú",
    "cart.continue": "Seguir pidiendo",
    "cart.checkout": "Proceder al pago",
    "cart.item": "artículo",
    "cart.items": "artículos",

    // Checkout
    "checkout.title": "Pagar",
    "checkout.subtitle": "Revisa tu pedido, elige la hora de recogida y haz tu pedido.",
    "checkout.contact.heading": "Contacto",
    "checkout.contact.name": "Nombre",
    "checkout.contact.name.placeholder": "Tu nombre",
    "checkout.contact.phone": "Teléfono",
    "checkout.contact.email": "Correo electrónico",
    "checkout.pickup.heading": "Recogida",
    "checkout.pickup.asap": "Lo antes posible",
    "checkout.pickup.asap.sub": "En cuanto esté listo",
    "checkout.pickup.scheduled": "Programado",
    "checkout.pickup.scheduled.sub": "Elige una hora",
    "checkout.pickup.time": "Hora de recogida",
    "checkout.pickup.select": "Selecciona un horario",
    "checkout.pickup.none": "No hay horarios disponibles en este momento.",
    "checkout.promo.heading": "Código de promoción",
    "checkout.promo.placeholder": "Ingresa el código",
    "checkout.promo.apply": "Aplicar",
    "checkout.promo.trying": "Código aplicado:",
    "checkout.tip.heading": "Propina",
    "checkout.tip.custom": "% personal",
    "checkout.tip.amount": "Monto de propina:",
    "checkout.order.heading": "Resumen del pedido",
    "checkout.order.loading": "Cargando carrito…",
    "checkout.order.empty": "Tu carrito está vacío.",
    "checkout.order.subtotal": "Subtotal",
    "checkout.order.discount": "Descuento",
    "checkout.order.tax": "Impuesto",
    "checkout.order.tip": "Propina",
    "checkout.order.total": "Total",
    "checkout.order.promo": "Promoción aplicada:",
    "checkout.submit": "Hacer pedido",
    "checkout.placing": "Haciendo pedido…",
    "checkout.fixErrors": "Por favor corrige los errores antes de hacer tu pedido.",
  },
};
