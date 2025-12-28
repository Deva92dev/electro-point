import { Button } from "@/components/ui/button";
import { ArrowRight, PlayCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Hero from "@/assets/Hero.webp";

const PureHero = () => {
  return (
    <section className="relative w-full min-h-[calc(100vh-4rem)] lg:min-h-[90vh] flex items-center overflow-hidden pt-12 pb-16 lg:py-0 bg-[#ffffff] dark:bg-[#0f172a]">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[14px_24px]">
        <div className="absolute hidden md:block left-0 right-0 top-0 -z-10 m-auto h-[300px] w-[300px] md:h-[400px] md:w-[400px] rounded-full bg-[#4338ca] dark:bg-[#818cf8] opacity-10 blur-[100px]"></div>
      </div>

      <div className="container px-4 md:px-8 mx-auto relative">
        {/* SVG Decoration */}
        <svg
          className="absolute hidden lg:block z-0 pointer-events-none"
          width="300"
          height="150"
          viewBox="0 0 300 150"
          style={{ left: "45%", top: "25%", color: "#4338ca" }}
        >
          <path
            d="M 0 120 Q 150 20 280 80"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray="8 8"
            className="text-[#4338ca]/40 dark:text-[#818cf8]/40"
          />
          <circle
            cx="280"
            cy="80"
            r="5"
            className="fill-[#4338ca] dark:fill-[#818cf8]"
          />
        </svg>

        <div className="grid lg:grid-cols-2 gap-8 items-center relative z-10">
          {/* Text Content */}
          <div className="flex flex-col space-y-6 md:space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight lg:text-6xl xl:text-8xl relative z-20 text-[#111111] dark:text-[#f8fafc]">
                Smart Tech <br />
                <span className="relative inline-block text-[#4338ca] dark:text-[#818cf8] mt-2">
                  For Smarter <br />
                  <span className="relative inline-block pt-3 pb-2">
                    Living
                    <svg
                      className="absolute w-full h-3 -bottom-1 left-0 opacity-30 -z-10 text-[#4338ca] dark:text-[#818cf8]"
                      viewBox="0 0 100 10"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0 5 Q 50 10 100 5"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                      />
                    </svg>
                  </span>
                </span>
              </h1>

              <p className="mx-auto lg:mx-0 max-w-none sm:max-w-[550px] xl:max-w-[700px] text-lg md:text-2xl leading-relaxed text-[#64748b] dark:text-[#94a3b8] font-medium">
                Discover the latest laptops, smartphones, and gadgets designed
                to elevate your productivity. Two-day delivery on all premium
                items.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/products" prefetch={true}>
                <Button
                  size="lg"
                  className="rounded-full w-full sm:w-auto px-10 h-14 text-lg font-semibold bg-[#4338ca] hover:bg-[#4338ca]/90 text-white dark:bg-[#818cf8] dark:hover:bg-[#818cf8]/90 dark:text-[#0f172a]"
                >
                  Shop Now <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>

              <Button
                variant="outline"
                size="lg"
                className="rounded-full w-full sm:w-auto px-10 h-14 text-lg font-semibold border-[#e2e8f0] dark:border-[#334155] text-[#111111] dark:text-[#f8fafc] hover:bg-[#f3f4f6] dark:hover:bg-[#334155]"
              >
                <PlayCircle className="mr-2 w-5 h-5" /> Watch Demo
              </Button>
            </div>

            {/* Trust Badge */}
            <div className="pt-2 sm:pt-4 flex items-center justify-center lg:justify-start gap-4 sm:gap-6 text-sm text-[#64748b] dark:text-[#94a3b8]">
              <div className="flex items-center gap-3 rounded-full pl-1 pr-4 py-1 border bg-[#f3f4f6]/50 border-[#e2e8f0]/50 dark:bg-[#334155]/50 dark:border-[#334155]/50">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 overflow-hidden relative border-[#ffffff] bg-[#f3f4f6] dark:border-[#0f172a] dark:bg-[#334155]"
                    >
                      <Image
                        src={Hero}
                        alt="Customer"
                        fill
                        loading="lazy"
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
                <p className="font-medium text-base">
                  <span className="font-bold text-[#111111] dark:text-[#f8fafc]">
                    1k+
                  </span>{" "}
                  Happy Customers
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Image */}
          <div className="relative flex justify-center items-center lg:justify-end mt-8 lg:mt-0 w-full">
            <svg
              className="absolute w-[120%] h-[120%] lg:w-[160%] lg:h-[160%] -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-110 lg:translate-x-12 text-[#4338ca]/10 dark:text-[#818cf8]/20"
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="currentColor"
                d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,79.6,-46.3C87.4,-33.5,90.1,-18,89,-2.9C87.9,12.2,83,26.9,74.4,39.4C65.8,51.9,53.4,62.2,40.1,68.2C26.8,74.2,12.6,75.9,-0.8,77.3C-14.2,78.7,-29.3,79.8,-42.6,73.7C-55.9,67.6,-67.4,54.3,-75.2,39.6C-83,24.9,-87.1,8.8,-84.8,-6.1C-82.5,-21,-73.8,-34.7,-63.1,-45.5C-52.4,-56.3,-39.7,-64.2,-26.8,-72.2C-13.9,-80.2,-0.8,-88.3,13.2,-87.9C27.2,-87.5,41.2,-78.6,44.7,-76.4Z"
                transform="translate(100 100)"
              />
            </svg>

            <div className="relative z-10 w-full max-w-[800px] aspect-4/5 sm:w-[500px] sm:h-[600px] lg:w-[750px] lg:h-[850px] xl:w-[900px] xl:h-[950px]">
              <Image
                src={Hero}
                alt="Person holding laptop with tech gear"
                fill
                preload={true}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 500px, (max-width: 1280px) 750px, 900px"
                className="object-contain md:drop-shadow-2xl hover:scale-105 transition-transform duration-500"
              />

              <div className="absolute bottom-4 -left-2 sm:bottom-10 sm:left-0 p-4 rounded-2xl shadow-xl bg-[#ffffff]/95 border border-[#e2e8f0]/50 dark:bg-[#0f172a]/95 dark:border-[#334155]/50 md:backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#dcfce7] dark:bg-[#14532d]">
                    <span className="font-bold text-xl text-[#16a34a] dark:text-[#4ade80]">
                      $
                    </span>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#64748b] dark:text-[#94a3b8]">
                      Best Price
                    </p>
                    <p className="font-bold text-lg text-[#111111] dark:text-[#f8fafc]">
                      Guaranteed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PureHero;
