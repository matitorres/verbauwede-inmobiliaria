const values = {
    // Contact information
    mail: 'verbauwedeinmobiliaria@gmail.com',
    mailLink: 'mailto:verbauwedeinmobiliaria@gmail.com?Subject=Solicitud%20de%20información',
    facebook: 'https://www.facebook.com/VIRealState/',
    instagram: 'https://instagram.com/verbauwede_inmobiliaria?igshid=gkuxldmvkpfw',
    whatsappNumber: '+54 9 266 4322263',
    whatsappLink: 'https://wa.me/5492664322263?text=Hola!%20Necesito%20comunicarme%20con%20ustedes.',
    phone: '+54 9 266 4322263',
    phoneLink: 'tel:+5492664322263',

    // Photos
    maxSecondaryPhotos: 13,

    // AWS S3
    bucket: 'verbauwede-inmobiliaria',
    s3BasePath: 'https://verbauwede-inmobiliaria.s3-sa-east-1.amazonaws.com/',

    // enums for models
    enumOperation: ['Venta', 'Alquiler', 'Alquiler temporal'],
    enumType: ['Casa', 'Departamento', 'Terreno - lote', 'Campo', 'Local', 'Oficina', 'Cocheras', 
    'Hotel - Complejo turístico', 'Galpón - Depósito', 'Negocio - Fondo de comercio',
    'Monoambiente', 'Dúplex - PH', 'Cabaña', 'Otros'],
    enumOrientation: [null, 'Norte', 'Este', 'Sur', 'Oeste'],
    enumServices: ['Acceso a internet', 'Linea telefónica', 'Cloacas', 'Gas natural', 'Luz eléctrica', 'Agua corriente'],
    enumFeaturesCasa: ['Acceso a internet', 'Linea telefónica', 'Cloacas', 'Gas natural', 'Aire acondicionado',
    'Luz eléctrica', 'Calefacción', 'Pileta', 'Portón automático', 'Seguridad', 'Alarma', 'Amoblado', 'Solo familias',
    'Altillo', 'Balcón', 'Dependencia de servicio', 'Dormitorio en suite', 'Estudio', 'Jardin', 'Agua corriente',
    'Parrilla', 'Patio', 'Placards', 'Playroom', 'Terraza', 'Vestidor', 'Jacuzzi', 'Colector solar',
    'Vivienda sustentable', 'Caldera', 'Chimenea', 'Cisterna', 'Area de cine', 'Area juegos infantiles',
    'Ascensor', 'Business center', 'Cancha de tennis', 'Estacionamiento para visitas', 'Gimnasio', 'Laundry', 
    'Salón de fiestas', 'Salón de usos múltiples', 'Cocina', 'Cocina comedor', 'Comedor', 'Living comedor', 
    'Living', 'Desayunador', 'Oficina', 'Lavadero', 'Toilette', 'Roof garden', 'Recepción', 'Grupo electrógeno', 
    'Expensas', 'Calefón solar', 'Energía renovable', 'Sistema de ventilación', 'Sistema contra incendios', 
    'Apto crédito', 'Financiación', 'Permuta'],
    enumFeaturesCampo: ['Acceso a internet', 'Linea telefónica', 'Cloacas', 'Gas natural', 'Agua corriente',
    'Luz eléctrica', 'Pileta', 'Bebederos', 'Riego', 'Casco', 'Corrales', 'Galpón', 'Molino', 'Silos', 'Alambrados',
    'Tanque de agua', 'Forestación', 'Campo ganadero', 'Campo agrícola', 'Campo mixto', 'Terreno irregular',
    'Terreno plano', 'Cisterna', 'Seguridad', 'Expensas', 'Apto crédito', 'Financiación', 'Permuta'],
    enumFeaturesCochera: ['Seguridad', 'Expensas', 'Apto crédito', 'Financiación', 'Permuta'],
    enumFeaturesNegocio: ['Seguridad', 'Expensas', 'Apto crédito', 'Financiación', 'Permuta'],
    enumFeaturesOtros: ['Apto crédito', 'Financiación', 'Permuta'],
    enumNeighborhoodType: [null, 'Barrio cerrado', 'Barrio abierto', 'Otro'],
    enumProvince: [null, 'Buenos Aires', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba', 'Corrientes', 'Entre Ríos', 'Formosa',
        'Jujuy', 'La Pampa', 'La Rioja', 'Mendoza', 'Misiones', 'Neuquén', 'Río Negro', 'Salta', 'San Juan',
        'San Luis', 'Santa Cruz', 'Santa Fe', 'Santiago del Estero', 'Tierra del Fuego', 'Tucumán'],
    enumAccess: [null, 'Arena', 'Asfalto', 'Ripio', 'Tierra', 'Otro'],
    enumGarageType: [null, 'Fija', 'Móvil'],
    enumGarageAccess: [null, 'Ascensor', 'Horizontal', 'Rampa fija', 'Rampa móvil'],

    // Pagination
    perPage: 15,
}

module.exports = values