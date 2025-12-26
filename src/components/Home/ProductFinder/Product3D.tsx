"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { ShoppingCart, Info, Star, Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatPrice } from "@/utils/util";

type ProductColor = {
  name: string;
  hex: string;
  lightHex: string;
};

const PRODUCT_DETAILS = {
  id: 35,
  name: "Sony WH-1000XM5",
  price: 346.0,
  discountPrice: 288.0,
  rating: 4.8,
  reviews: 2150,
  specs: ["30hr Battery", "Noise Cancelling", "Hi-Res Audio"],
  colors: [
    { name: "Midnight Black", hex: "#111111", lightHex: "#606060" },
    { name: "Platinum Silver", hex: "#e0e0e0", lightHex: "#ffffff" },
    { name: "Navy Blue", hex: "#1e3a8a", lightHex: "#60a5fa" },
  ] as ProductColor[],
};

const Product3D = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  const [activeColor, setActiveColor] = useState<ProductColor>(
    PRODUCT_DETAILS.colors[0]!
  );

  // Refs for Three.js objects (needed for cleanup and access inside callbacks)
  const sceneRef = useRef<THREE.Scene | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const rimLightRef = useRef<THREE.PointLight | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const reqIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Helper to initialize the scene safely
    const initScene = () => {
      if (!mountRef.current) return;

      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;

      // If dimensions are 0 (lazy load issue), wait.
      if (width === 0 || height === 0) return;

      // Prevent double initialization
      if (sceneRef.current) return;

      const scene = new THREE.Scene();
      sceneRef.current = scene;

      // Renderer
      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.5;
      rendererRef.current = renderer;

      mountRef.current.appendChild(renderer.domElement);

      // Camera
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.set(3, 1.5, 4);
      cameraRef.current = camera;

      //  Controls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.enableZoom = false;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 1.5;
      controls.minPolarAngle = Math.PI / 4;
      controls.maxPolarAngle = Math.PI / 1.8;
      controlsRef.current = controls;

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
      scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xffffff, 3);
      dirLight.position.set(5, 10, 7);
      scene.add(dirLight);

      const rimLight = new THREE.PointLight(0xffffff, 10);
      rimLight.position.set(-5, 2, -5);
      scene.add(rimLight);
      rimLightRef.current = rimLight;

      // Load Model
      const loader = new GLTFLoader();
      loader.load(
        "/Sony.glb",
        (gltf) => {
          const model = gltf.scene;
          modelRef.current = model;

          // Center Model
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          model.position.sub(center);

          // Scale Model
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          const scaleFactor = 3 / maxDim;
          model.scale.set(scaleFactor, scaleFactor, scaleFactor);

          // Initial Material Setup
          model.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material) {
              const mat = child.material.clone();
              mat.color.set(activeColor.hex);

              if (activeColor.name === "Midnight Black") {
                mat.roughness = 0.3;
                mat.metalness = 0.4;
              }
              child.material = mat;
            }
          });

          scene.add(model);
          setLoading(false);
        },
        undefined,
        (error) => {
          console.error("An error happened loading the GLB:", error);
          setLoading(false);
        }
      );

      // Animation Loop
      const animate = () => {
        reqIdRef.current = requestAnimationFrame(animate);
        if (controlsRef.current) controlsRef.current.update();
        if (rendererRef.current && sceneRef.current && cameraRef.current) {
          rendererRef.current.render(sceneRef.current, cameraRef.current);
        }
      };
      animate();
    };

    // Use ResizeObserver to trigger init when div actually has size
    const observer = new ResizeObserver(() => {
      // If scene doesn't exist yet, try to init
      if (!sceneRef.current) {
        initScene();
      } else {
        // If scene exists, just resize
        if (!mountRef.current || !rendererRef.current || !cameraRef.current)
          return;
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(width, height);
      }
    });

    observer.observe(mountRef.current);

    // cleanup
    return () => {
      observer.disconnect();
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (mountRef.current && rendererRef.current.domElement) {
          // Safely remove child
          if (mountRef.current.contains(rendererRef.current.domElement)) {
            mountRef.current.removeChild(rendererRef.current.domElement);
          }
        }
      }
      // Dispose materials to prevent memory leaks
      if (sceneRef.current) {
        sceneRef.current.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
            obj.geometry.dispose();
            if (obj.material instanceof THREE.Material) {
              obj.material.dispose();
            }
          }
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //  dynamic color update
  useEffect(() => {
    if (!modelRef.current || !activeColor) return;

    // Update Product Material
    modelRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        // Clone ensures we don't mess up shared materials if multiple objects use it
        const mat = child.material.clone();
        mat.color.set(activeColor.hex);

        if (activeColor.name === "Midnight Black") {
          mat.roughness = 0.3;
          mat.metalness = 0.4;
        } else {
          mat.roughness = 0.5;
          mat.metalness = 0.1;
        }

        child.material = mat;
      }
    });

    // Update Rim Light
    if (rimLightRef.current) {
      rimLightRef.current.color.set(activeColor.lightHex);
    }
  }, [activeColor]);

  // We do NOT return null here anymore, so the div exists for ResizeObserver
  return (
    <div className="relative w-full h-full flex items-center justify-center bg-zinc-950 overflow-hidden rounded-3xl shadow-2xl border border-white/10">
      {/* 3D Canvas Mount Point */}
      <div
        ref={mountRef}
        className="w-full h-full z-0 cursor-grab active:cursor-grabbing"
      />

      {/* Loading State */}
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20 bg-black/50 backdrop-blur-sm">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm font-medium animate-pulse">
            Loading 4K Model...
          </p>
        </div>
      )}
      {/* UI Overlay (Only visible after loading) */}
      {!loading && (
        <div className="absolute inset-0 pointer-events-none p-8 flex flex-col justify-between z-10">
          {/* Top Right: Specs */}
          <div className="flex flex-col items-end space-y-2">
            {PRODUCT_DETAILS.specs.map((spec, i) => (
              <span
                key={spec}
                className="bg-black/40 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium border border-white/10 shadow-lg animate-in slide-in-from-right fade-in duration-700"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {spec}
              </span>
            ))}
          </div>

          {/* Bottom Left: Controls */}
          <div className="mt-auto pointer-events-auto max-w-md">
            {/* Rating */}
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-white font-semibold">
                {PRODUCT_DETAILS.rating}
              </span>
              <span className="text-gray-400 text-sm">
                ({PRODUCT_DETAILS.reviews})
              </span>
            </div>

            {/* Title & Price */}
            <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">
              {PRODUCT_DETAILS.name}
            </h2>
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-white">
                {formatPrice(PRODUCT_DETAILS.discountPrice)}
              </span>
              <span className="text-lg text-gray-500 line-through">
                {formatPrice(PRODUCT_DETAILS.price)}
              </span>
            </div>

            {/* Controls Box */}
            <div className="flex flex-col gap-6 bg-black/30 backdrop-blur-md p-4 rounded-xl border border-white/10">
              {/* Color Selector */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">
                  Color: {activeColor.name}
                </span>
                <div className="flex gap-3">
                  {PRODUCT_DETAILS.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setActiveColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all duration-300 hover:scale-110 ${
                        activeColor.name === color.name
                          ? "border-white scale-110 ring-2 ring-white/20"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      aria-label={`Select ${color.name}`}
                    />
                  ))}
                </div>
              </div>
              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button className="flex-1 gap-2 bg-white text-black hover:bg-gray-200 transition-colors">
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </Button>
                <Button className="flex-1 gap-2 border-white/30 text-white hover:bg-white/10 hover:text-white bg-transparent">
                  <Info className="w-4 h-4" />
                  <Link href={`/products/${PRODUCT_DETAILS.id}`}>Details</Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white border border-white/30 hover:bg-white/10"
                  title="View in AR"
                >
                  <Box className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Background Glow */}
      <div
        className="absolute inset-0 z-[-1] transition-colors duration-1000 opacity-40 blur-[150px]"
        style={{
          background: `radial-gradient(circle at 60% 40%, ${activeColor?.lightHex} 0%, transparent 60%)`,
        }}
      />
    </div>
  );
};

export default Product3D;
