import {
  boolean,
  decimal,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  real,
  serial,
  text,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const productTypes = pgEnum("product_type", [
  "laptop",
  "smartphone",
  "tablet",
  "smartwatch",
  "headphones",
  "tv",
]);

// categories
export const categories = pgTable(
  "categories",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    productType: productTypes("product_type").notNull(),
    description: text("description"),
    imageUrl: text("image_url"),
    displayOrder: integer("display_order").default(0),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    index("category_slug_idx").on(table.slug),
    index("category_is_Active_idx").on(table.isActive),
  ]
);

// brands
export const brands = pgTable(
  "brands",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull().unique(),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    index("brand_slug_idx").on(table.slug),
    index("brand_is_active_idx").on(table.isActive),
  ]
);

// products
export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description").notNull(),
    shortDescription: text("short_description").notNull(),
    categoryId: integer("category_id")
      .references(() => categories.id)
      .notNull(),
    brandId: integer("brand_id").references(() => brands.id),
    availableColors: jsonb("colors")
      .$type<{ name: string; hex: string }[]>()
      .default([]),
    productType: productTypes("product_type").notNull(),
    stock: integer("stock").default(0).notNull(),
    mainImagePath: text("main_image_path"),
    basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
    salePrice: decimal("sale_price", { precision: 10, scale: 2 }),
    quickSpecs:
      jsonb("quick_Specs").$type<Record<string, string | undefined>>(), // most searchable, like ram, core, etc
    model: text("model"),
    sku: text("sku").unique(),
    warranty: text("warranty"),
    releaseYear: integer("release_year"),
    isActive: boolean("is_active").default(true),
    isFeatured: boolean("is_featured").default(false),
    isNewArrival: boolean("is_new_arrival").default(false),
    isBestseller: boolean("is_bestseller").default(false),
    metaTitle: text("meta_title"),
    metaDescription: text("meta_description"),
    averageRating: real("average_rating").default(0),
    totalReviews: integer("total_reviews").default(0),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    // foreign keys(speed up joins)
    index("product_category_id_idx").on(table.categoryId),
    index("product_brand_id_idx").on(table.brandId),

    // Filtering(speed up where clauses)
    index("product_is_active_idx").on(table.isActive),
    index("product_type_idx").on(table.productType),

    // Sorting (Speed up order by)
    index("product_price_idx").on(table.basePrice),
    index("product_rating_idx").on(table.averageRating),
    index("product_created_at_idx").on(table.createdAt),

    // Featured
    index("product_is_featured_idx").on(table.isFeatured),
  ]
);

// LAPTOP SPECIFICATIONS
export const laptopSpecs = pgTable(
  "laptop_specs",
  {
    id: serial("id").primaryKey().notNull(),
    productId: integer("product_id")
      .references(() => products.id, { onDelete: "cascade" })
      .notNull()
      .unique(),
    processorBrand: text("processor_brand"),
    processorModel: text("processor_model"),
    processorGeneration: text("processor_generation"),
    processorCores: integer("processor_cores"),
    processorThreads: integer("processor_threads"),
    processorSpeed: text("processor_speed"),
    processorBoostSpeed: text("processor_boost_speed"),
    ramSize: integer("ram_size"),
    ramType: text("ram_type"),
    storageInterface: text("storage_interface"),
    additionalStorageSlots: integer("additional_storage_slots"),
    screenSize: decimal("screen_size", { precision: 4, scale: 2 }),
    screenResolution: text("screen_resolution"),
    screenType: text("screen_type"),
    refreshRate: integer("refresh_rate"),
    brightness: integer("brightness"),
    colorGamut: text("color_gamut"),
    touchscreen: boolean("touchscreen").default(false),
    graphicsCard: text("graphics_card"),
    graphicsMemory: integer("graphics_memory"),
    integratedGraphics: text("integrated_graphics"),
    weight: decimal("weight", { precision: 5, scale: 2 }),
    dimensions: text("dimensions"),
    material: text("material"),
    color: text("color"),
    backlitKeyboard: boolean("backlit_keyboard").default(false),
    fingerprintReader: boolean("fingerprint_reader").default(false),
    batteryCapacity: text("battery_capacity"),
    batteryLife: text("battery_life"),
    chargerWattage: integer("charger_wattage"),
    usbCCharging: boolean("usbc_charging").default(false),
    wifi: text("wifi"),
    bluetooth: text("bluetooth"),
    ethernet: boolean("ethernet").default(false),
    usbPorts: text("usb_ports"),
    hdmiPort: boolean("hdmi_port").default(false),
    displayPort: boolean("display_port").default(false),
    audioJack: boolean("audio_jack").default(true),
    sdCardReader: boolean("sd_Card_reader").default(false),
    speakers: text("speakers"),
    microphone: text("microphone"),
    webcam: text("webcam"),
    webcamPrivacyShutter: boolean("webcam_privacy_shutter").default(false),
    operatingSystem: text("operating_system"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [index("laptop_specs_product_id_idx").on(table.productId)]
);

// SMARTPHONE SPECIFICATIONS
export const smartphoneSpecs = pgTable(
  "smartphone_specs",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .references(() => products.id, { onDelete: "cascade" })
      .notNull()
      .unique(),
    screenSize: decimal("screen_size", { precision: 4, scale: 2 }),
    screenResolution: text("screen_resolution"),
    screenType: text("screen_type"),
    refreshRate: integer("refresh_rate"),
    peakBrightness: integer("peak_brightness"),
    ppi: integer("ppi"),
    protectionGlass: text("protection_glass"),
    hdr: boolean("hdr").default(false),
    alwaysOnDisplay: boolean("always_on_display").default(false),
    chipset: text("chipset"),
    gpu: text("gpu"),
    cpu: text("cpu"),
    ramSize: integer("ram_size"),
    ramType: text("ram_type"),
    storageSize: integer("storage_size"),
    storageType: text("storage_type"),
    expandableStorage: boolean("expandable_storage").default(false),
    maxStorageExpansion: integer("max_storage_expansion"),
    rearCameraMain: text("rear_camera_main"),
    rearCameraUltrawide: text("rear_camera_ultrawide"),
    rearCameraTelephoto: text("rear_camera_telephoto"),
    rearCameraMacro: text("rear_camera_macro"),
    rearCameraDepth: text("rear_camera_depth"),
    videoRecording: text("video_recording"),
    opticalImageStabilization: boolean("optical_image_stabilization").default(
      false
    ),
    frontCamera: text("front_camera"),
    frontVideoRecording: text("front_video_recording"),
    batteryCapacity: integer("battery_capacity"),
    chargingSpeed: text("charging_speed"),
    fastCharging: boolean("fast_charging").default(false),
    wirelessCharging: boolean("wireless_charging").default(false),
    reverseWirelessCharging: boolean("reverse_wireless_charging").default(
      false
    ),
    weight: decimal("wight", { precision: 5, scale: 2 }),
    buildMaterial: text("build_material"),
    dimensions: text("dimensions"),
    colors: jsonb("colors"),
    waterResistance: text("water_resistance"),
    dustResistance: text("dust_resistance"),
    network5g: boolean("network_5g").default(false),
    network4g: boolean("network_4g").default(true),
    dualSim: boolean("dual_sim").default(false),
    esim: boolean("esim").default(false),
    wifi: text("wifi"),
    bluetooth: text("bluetooth"),
    usbType: text("usb_type"),
    nfc: boolean("nfc").default(false),
    infrared: boolean("infrared").default(false),
    audioJack: boolean("audio_jack").default(false),
    speakers: text("speakers"),
    fingerprintSensor: text("fingerprint_sensor"),
    faceUnlock: boolean("face_unlock").default(false),
    operatingSystem: text("operating_system"),
    osVersion: text("os_version"),
    features: jsonb("features"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [index("smartphone_specs_product_id_idx").on(table.productId)]
);

export const tabletSpecs = pgTable(
  "tablet_specs",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .references(() => products.id, { onDelete: "cascade" })
      .notNull()
      .unique(),
    screenSize: decimal("screen_size", { precision: 4, scale: 2 }),
    screenResolution: text("screen_resolution"),
    screenType: text("screen_type"),
    refreshRate: integer("refresh_rate"),
    brightness: integer("brightness"),
    ppi: integer("ppi"),
    chipset: text("chipset"),
    gpu: text("gpu"),
    cpu: text("cpu"),
    ramSize: integer("ram_size"),
    storageSize: integer("storage_size"),
    expandableStorage: boolean("expandable_storage").default(false),
    rearCamera: text("rear_camera"),
    frontCamera: text("front_camera"),
    videoRecording: text("video_recording"),
    batteryCapacity: integer("battery_capacity"),
    chargingSpeed: text("charging_speed"),
    batteryLife: text("battery_life"),
    weight: decimal("weight", { precision: 5, scale: 2 }),
    dimensions: text("dimensions"),
    colors: jsonb("colors"),
    wifi: text("wifi"),
    bluetooth: text("bluetooth"),
    cellular: boolean("cellular").default(false),
    network5G: boolean("network_5g").default(false),
    speakers: text("speakers"),
    audioJack: boolean("audio_jack").default(false),
    stylusSupport: boolean("stylus_support").default(false),
    keyboardSupport: boolean("keyboard_support").default(false),
    operatingSystem: text("operating_system"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [index("tablet_specs_product_id_idx").on(table.productId)]
);

export const smartwatchSpecs = pgTable(
  "smartwatch_specs",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .references(() => products.id, { onDelete: "cascade" })
      .notNull()
      .unique(),
    screenSize: decimal("screen_size", { precision: 4, scale: 2 }),
    screenResolution: text("screen_resolution"),
    screenType: text("screen_type"),
    alwaysOnDisplay: boolean("always_on_display").default(false),
    touchscreen: boolean("touchscreen").default(true),
    caseSize: text("case_size"),
    caseMaterial: text("case_material"),
    bandMaterial: text("band_material"),
    weight: decimal("weight", { precision: 5, scale: 2 }),
    waterResistance: text("water_resistance"),
    colors: jsonb("colors"),
    chipset: text("chipset"),
    ram: text("ram"),
    storage: text("storage"),
    batteryLife: text("battery_life"),
    chargingTime: text("charging_time"),
    wirelessCharging: boolean("wireless_charging").default(false),
    heartRateMonitor: boolean("heart_rate_monitor").default(false),
    ecg: boolean("ecg").default(false),
    bloodOxygen: boolean("blood_oxygen").default(false),
    bloodPressure: boolean("blood_pressure").default(false),
    sleepTracking: boolean("sleep_tracking").default(false),
    stressMonitoring: boolean("stress_monitoring").default(false),
    bodyTemperature: boolean("body_temperature").default(false),
    stepCounter: boolean("step_counter").default(true),
    calorieTracking: boolean("calorie_tracking").default(true),
    distanceTracking: boolean("distance_tracking").default(true),
    workoutModes: integer("workout_modes"),
    gps: boolean("gps").default(false),
    bluetooth: text("bluetooth"),
    wifi: boolean("wifi").default(false),
    cellular: boolean("cellular").default(false),
    nfc: boolean("nfc").default(false),
    voiceAssistant: text("voice_assistant"),
    notificationSupport: boolean("notification_support").default(true),
    callSupport: boolean("call_support").default(false),
    musicStorage: boolean("music_storage").default(false),
    compatibleWithIOS: boolean("compatible_with_ios").default(false),
    compatibleWithAndroid: boolean("compatible_with_android").default(false),
    operatingSystem: text("operating_system"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [index("smartwatch_specs_product_id_idx").on(table.productId)]
);

export const headphonesSpecs = pgTable(
  "headphones_specs",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .references(() => products.id, { onDelete: "cascade" })
      .notNull()
      .unique(),
    headphoneType: text("headphone_type"), // "Over-Ear", "On-Ear", "In-Ear", "Earbuds"
    formFactor: text("form_factor"), // "Wired", "Wireless", "True Wireless"
    driverSize: text("driver_size"),
    frequencyResponse: text("frequency_response"),
    impedance: text("impedance"),
    sensitivity: text("sensitivity"),
    audioCodecs: jsonb("audio_codecs"),
    anc: boolean("anc").default(false),
    ancLevels: text("anc_levels"),
    ambientMode: boolean("ambient_mode").default(false),
    connectionType: text("connection_type"),
    bluetooth: text("bluetooth"),
    bluetoothRange: text("bluetooth_range"),
    multipoint: boolean("multipoint").default(false),
    audioJack: boolean("audio_jack").default(false),
    batteryLife: text("battery_life"),
    batteryLifeWithANC: text("battery_life_with_anc"),
    chargingTime: text("charging_time"),
    quickCharge: boolean("quick_charge").default(false),
    wirelessCharging: boolean("wireless_charging").default(false),
    chargingCase: boolean("charging_case").default(false),
    caseBatteryLife: text("case_battery_life"),
    microphone: boolean("microphone").default(false),
    micType: text("mic_type"),
    callQuality: text("call_quality"),
    controls: text("controls"),
    touchControls: boolean("touch_controls").default(false),
    voiceAssistant: boolean("voice_assistant").default(false),
    weight: decimal("weight", { precision: 5, scale: 2 }),
    foldable: boolean("foldable").default(false),
    sweatResistant: boolean("sweat_resistant").default(false),
    waterResistance: text("water_resistance"),
    colors: jsonb("colors"),
    earTips: text("ear_tips"),
    adjustableBand: boolean("adjustable_band").default(false),
    features: jsonb("features"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [index("headphones_specs_product_id_idx").on(table.productId)]
);

export const tvSpecs = pgTable(
  "tv_specs",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .references(() => products.id, { onDelete: "cascade" })
      .notNull()
      .unique(),
    screenSize: decimal("screen_size", { precision: 5, scale: 2 }),
    screenResolution: text("screen_resolution"),
    displayTechnology: text("display_technology"), // "OLED", "QLED", "LED", "Mini-LED", "LCD"
    refreshRate: integer("refresh_rate"),
    hdr: boolean("hdr").default(false),
    hdrFormats: jsonb("hdr_formats"),
    peakBrightness: integer("peak_brightness"),
    contrastRatio: text("contrast_ratio"),
    viewingAngle: text("viewing_angle"),
    responseTime: text("response_time"),
    smartTV: boolean("smart_tv").default(true),
    operatingSystem: text("operating_system"),
    voiceAssistant: jsonb("voice_assistant"),
    screenMirroring: boolean("screen_mirroring").default(false),
    airplaySupport: boolean("airplay_support").default(false),
    chromecastBuiltIn: boolean("chromecast_built_in").default(false),
    processor: text("processor"),
    ram: text("ram"),
    storage: text("storage"),
    audioOutput: text("audio_output"),
    speakers: text("speakers"), // "2.1 Channel", "Dolby Atmos"
    audioFormats: jsonb("audio_formats"),
    hdmiPorts: integer("hdmi_ports"),
    hdmiVersion: text("hdmi_version"),
    usbPorts: integer("usb_ports"),
    ethernetPort: boolean("ethernet_port").default(true),
    opticalAudioOut: boolean("optical_audio_out").default(false),
    headphoneJack: boolean("headphone_jack").default(false),
    wifi: text("wifi"),
    bluetooth: text("bluetooth"),
    gamingMode: boolean("gaming_mode").default(false),
    vrr: boolean("vrr").default(false), // Variable Refresh Rate
    allm: boolean("allm").default(false), // Auto Low Latency Mode
    freesync: boolean("freesync").default(false),
    gsync: boolean("gsync").default(false),
    weight: decimal("weight", { precision: 6, scale: 2 }),
    weightWithStand: decimal("weight_with_stand", { precision: 6, scale: 2 }),
    dimensions: text("dimensions"), // Without stand
    dimensionsWithStand: text("dimensions_with_stand"),
    bezels: text("bezels"),
    standType: text("stand_type"), // "Center stand", "Two legs"
    vesaMountSupport: text("vesa_mount_support"), // "200x200mm", "400x400mm"
    colors: jsonb("colors"),
    powerConsumption: text("power_consumption"),
    energyRating: text("energy_rating"), // "A+", "A++", "Energy Star"
    ambientMode: boolean("ambient_mode").default(false),
    pictureInPicture: boolean("picture_in_picture").default(false),
    usbRecording: boolean("usb_recording").default(false),
    timeshift: boolean("timeshift").default(false),
    builtInTuner: text("built_in_tuner"), // "DVB-T2/C/S2"
    panelWarranty: text("panel_warranty"),
    features: jsonb("features"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [index("tv_specs_product_id_idx").on(table.productId)]
);

export const productVariants = pgTable(
  "product_variants",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .references(() => products.id, { onDelete: "cascade" })
      .notNull(),
    variantName: text("variant_name").notNull(),
    sku: text("sku").unique().notNull(),
    color: text("color"),
    storage: text("storage"),
    ram: text("ram"),
    size: text("size"),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    salePrice: decimal("sale_price", { precision: 10, scale: 2 }),
    stockQuantity: integer("stock_quantity").default(0).notNull(),
    lowStockThreshold: integer("low_stock_threshold").default(5),
    imagePath: text("image_path"),
    isActive: boolean("is_active").default(true),
    isDefault: boolean("is_default").default(false), // for images
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [index("variant_product_id_idx").on(table.productId)]
);

export const productImages = pgTable(
  "product_images",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .references(() => products.id, { onDelete: "cascade" })
      .notNull(),
    imagePath: text("image_path").notNull(),
    imageKitFileId: text("imagekit_file_id"),
    altText: text("alt_text").notNull(),
    title: text("title"),
    displayOrder: integer("display_order").default(0),
    width: integer("width"),
    height: integer("height"),
    isMainImage: boolean("is_main_image").default(false),
    imageType: text("image_type"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [index("image_product_id_idx").on(table.productId)]
);

export const reviews = pgTable(
  "reviews",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .references(() => products.id, { onDelete: "cascade" })
      .notNull(),
    orderId: integer("order_id")
      .references(() => orders.id)
      .notNull(),
    userId: text("user_id").references(() => user.id),
    userName: text("user_name").notNull(),
    userEmail: text("user_email"),
    rating: integer("rating").notNull(),
    title: text("title"),
    comment: text("comment").notNull(),
    isVerifiedPurchase: boolean("is_verified_purchase").default(false),
    isApproved: boolean("is_approved").default(false),
    helpfulCount: integer("helpful_count").default(0),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    index("review_product_id_idx").on(table.productId),
    index("review_rating_idx").on(table.rating),
  ]
);

// tags used for advance filtering
export const tags = pgTable(
  "tags",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull().unique(),
    slug: text("slug").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [index("tag_slug_idx").on(table.slug)]
);

export const productTags = pgTable(
  "product_tags",
  {
    productId: integer("product_id")
      .references(() => products.id, { onDelete: "cascade" })
      .notNull(),
    tagId: integer("tag_id")
      .references(() => tags.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => [
    // Index BOTH sides of the relationship for fast lookups both ways
    index("product_tags_product_id_idx").on(table.productId),
    index("product_tags_tag_id_idx").on(table.tagId),
  ]
);

export const wishlists = pgTable(
  "wishlists",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(), // Better-Auth user ID
    productId: integer("product_id")
      .references(() => products.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    index("wishlist_user_id_idx").on(table.userId),
    index("wishlist_product_id_idx").on(table.productId),
    // FIXED: A user can only have a product once in their wishlist
    uniqueIndex("wishlist_user_product_unique").on(
      table.userId,
      table.productId
    ),
  ]
);

// --- AUTH SCHEMA (Better-Auth Standard) ---
export const user = pgTable(
  "user",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").notNull(),
    image: text("image"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
  },
  (table) => [index("user_email_idx").on(table.email)]
);

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id),

    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
  },
  (table) => [
    index("session_user_id_idx").on(table.userId),
    index("session_token_idx").on(table.token),
  ]
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),

    // OAuth metadata
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),

    password: text("password"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
  },
  (table) => [index("account_user_id_idx").on(table.userId)]
);

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

// carts
export const cart = pgTable("cart", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
  // For guests,  use a session cookie ID, but for V1 rely on local storage for guests.
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const cartItems = pgTable(
  "cart_items",
  {
    id: serial("id").primaryKey(),
    cartId: integer("cart_id")
      .references(() => cart.id, { onDelete: "cascade" })
      .notNull(),
    productId: integer("product_id")
      .references(() => products.id, { onDelete: "cascade" })
      .notNull(),
    // variantId should be NotNull to ensure every cart item points to a specific SKU
    variantId: integer("variant_id").references(() => productVariants.id),
    quantity: integer("quantity").default(1).notNull(),
    // Price snapshotting to detect price changes before checkout
    priceAtAdd: decimal("price_at_add", { precision: 10, scale: 2 }).notNull(),
  },
  (table) => [
    index("cart_item_cart_idx").on(table.cartId),
    index("cart_item_product_idx").on(table.productId),

    // Include productId in the unique constraint
    // This allows multiple Simple Products (variantId=null) in the same cart
    uniqueIndex("cart_item_unique_idx").on(
      table.cartId,
      table.productId,
      table.variantId
    ),
  ]
);

// orders
export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "paid",
  "failed",
  "refunded",
]);

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => user.id), // can be null for guest
  guestEmail: text("guest_email"), // Fallback for guest checkout
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: orderStatusEnum("status").default("pending").notNull(),
  paymentStatus: paymentStatusEnum("payment_status")
    .default("pending")
    .notNull(),
  //Addresses (You might want separate address tables later, but JSONB is fast for V1)
  shippingAddress: jsonb("shipping_address").notNull(),
  billingAddress: jsonb("billing_address"),

  stripePaymentIntentId: text("stripe_payment_intent_id").unique(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .references(() => orders.id, { onDelete: "cascade" })
    .notNull(),
  productId: integer("product_id")
    .references(() => products.id)
    .notNull(),
  variantId: integer("variant_id").references(() => productVariants.id),

  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(), // Snapshot of price at purchase time
});

// RELATIONS
export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(user, { fields: [orders.userId], references: [user.id] }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
  variant: one(productVariants, {
    fields: [orderItems.variantId],
    references: [productVariants.id],
  }),
}));

export const cartsRelations = relations(cart, ({ one, many }) => ({
  user: one(user, { fields: [cart.userId], references: [user.id] }),
  items: many(cartItems),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(cart, { fields: [cartItems.cartId], references: [cart.id] }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
  variant: one(productVariants, {
    fields: [cartItems.variantId],
    references: [productVariants.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const brandsRelations = relations(brands, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id],
  }),
  laptopSpecs: one(laptopSpecs),
  smartphoneSpecs: one(smartphoneSpecs),
  tabletSpecs: one(tabletSpecs),
  smartwatchSpecs: one(smartwatchSpecs),
  headphonesSpecs: one(headphonesSpecs),
  tvSpecs: one(tvSpecs),
  variants: many(productVariants),
  images: many(productImages),
  reviews: many(reviews),
  tags: many(productTags),
  wishlists: many(wishlists),
}));

export const laptopSpecsRelations = relations(laptopSpecs, ({ one }) => ({
  product: one(products, {
    fields: [laptopSpecs.productId],
    references: [products.id],
  }),
}));

export const smartphoneSpecsRelations = relations(
  smartphoneSpecs,
  ({ one }) => ({
    product: one(products, {
      fields: [smartphoneSpecs.productId],
      references: [products.id],
    }),
  })
);

export const tabletSpecsRelations = relations(tabletSpecs, ({ one }) => ({
  product: one(products, {
    fields: [tabletSpecs.productId],
    references: [products.id],
  }),
}));

export const smartwatchSpecsRelations = relations(
  smartwatchSpecs,
  ({ one }) => ({
    product: one(products, {
      fields: [smartwatchSpecs.productId],
      references: [products.id],
    }),
  })
);

export const headphonesSpecsRelations = relations(
  headphonesSpecs,
  ({ one }) => ({
    product: one(products, {
      fields: [headphonesSpecs.productId],
      references: [products.id],
    }),
  })
);

export const tvSpecsRelations = relations(tvSpecs, ({ one }) => ({
  product: one(products, {
    fields: [tvSpecs.productId],
    references: [products.id],
  }),
}));

export const productVariantsRelations = relations(
  productVariants,
  ({ one }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
    }),
  })
);

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
  user: one(user, {
    fields: [reviews.userId],
    references: [user.id],
  }),
  order: one(orders, { fields: [reviews.orderId], references: [orders.id] }),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  products: many(productTags),
}));

export const productTagsRelations = relations(productTags, ({ one }) => ({
  product: one(products, {
    fields: [productTags.productId],
    references: [products.id],
  }),
  tag: one(tags, {
    fields: [productTags.tagId],
    references: [tags.id],
  }),
}));

export const wishlistsRelations = relations(wishlists, ({ one }) => ({
  product: one(products, {
    fields: [wishlists.productId],
    references: [products.id],
  }),
}));
