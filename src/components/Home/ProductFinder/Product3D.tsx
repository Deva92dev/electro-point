"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { ShoppingCart, Info, Star, Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatPrice } from "@/utils/util";

const PRODUCT_DETAILS = {
  id: 35,
  name: "Sony WH-1000XM5",
  price: 346.0,
  discountPrice: 288.0,
  rating: 4.8,
  reviews: 2150,
  specs: ["30hr Battery", "Noise Cancelling", "Hi-Res Audio"],
  colors: [
    { name: "Midnight Black", hex: "#111111" },
    { name: "Platinum Silver", hex: "#e0e0e0" },
    { name: "Navy Blue", hex: "#1e3a8a" },
  ],
};

const Product3D = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [activeColor, setActiveColor] = useState(PRODUCT_DETAILS.colors[0]);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);

  //  Initialize Three.js Scene
  useEffect(() => {
    if (!mountRef.current) return;

    // Scene & Renderer
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    if (width === 0 || height === 0) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    mountRef.current.appendChild(renderer.domElement);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(3, 1.5, 4);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.5;
    controls.minPolarAngle = Math.PI / 4;
    controls.maxPolarAngle = Math.PI / 1.8;

    // Lighting (Studio Setup)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);
    const rimLight = new THREE.PointLight(0x3b82f6, 5);
    rimLight.position.set(-5, 5, -5);
    scene.add(rimLight);

    // Load Model
    const loader = new GLTFLoader();
    loader.load(
      "/Sony.glb",
      (gltf) => {
        const model = gltf.scene;
        modelRef.current = model;

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);

        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scaleFactor = 3 / maxDim;
        model.scale.set(scaleFactor, scaleFactor, scaleFactor);

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
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle Resize
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (obj.material instanceof THREE.Material) {
            obj.material.dispose();
          }
        }
      });
    };
  }, []);

  // Handle Color Change
  useEffect(() => {
    if (!modelRef.current) return;

    modelRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const mat = child.material.clone();
        mat.color.set(activeColor?.hex);
        child.material = mat;
      }
    });
  }, [activeColor]);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-[radial-gradient(circle_at_center,#2a2a2a_0%,#000000_100%)] overflow-hidden rounded-3xl shadow-2xl border border-white/10">
      {/* 3D Canvas */}
      <div
        ref={mountRef}
        className="w-full h-full z-0 cursor-grab active:cursor-grabbing"
      />
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20 bg-black/50 backdrop-blur-sm">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm font-medium animate-pulse">
            Loading 4K Model...
          </p>
        </div>
      )}
      {/* UI Overlay */}
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
          {/* Bottom Left: Info & Controls */}
          <div className="mt-auto pointer-events-auto max-w-md">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-white font-semibold">
                {PRODUCT_DETAILS.rating}
              </span>
              <span className="text-gray-400 text-sm">
                ({PRODUCT_DETAILS.reviews})
              </span>
            </div>
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
            {/* Controls */}
            <div className="flex flex-col gap-6 bg-black/30 backdrop-blur-md p-4 rounded-xl border border-white/10">
              {/* Color Selector */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">
                  Color: {activeColor?.name}
                </span>
                <div className="flex gap-3">
                  {PRODUCT_DETAILS.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setActiveColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all duration-300 hover:scale-110 ${
                        activeColor?.name === color.name
                          ? "border-white scale-110 ring-2 ring-white/20"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      aria-label={`Select ${color.name}`}
                    />
                  ))}
                </div>
              </div>
              {/* CTAs */}
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
      <div
        className="absolute inset-0 z-[-1] transition-colors duration-1000 opacity-20 blur-[150px]"
        style={{
          background: `radial-gradient(circle at 70% 30%, ${activeColor?.hex} 0%, transparent 70%)`,
        }}
      />
    </div>
  );
};

export default Product3D;
