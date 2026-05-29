import { useListUniversities, useListDestinations } from "@workspace/api-client-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Globe } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useSearch } from "wouter";

export default function Universities() {
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const initialCountry = searchParams.get("country") || "All";

  const [activeTab, setActiveTab] = useState(initialCountry);

  const { data: destinations } = useListDestinations();
  const { data: universities, isLoading } = useListUniversities(
    activeTab !== "All" ? { country: activeTab } : undefined
  );

  const countries = ["All", ...(destinations?.map(d => d.country) || [])];

  const filteredUniversities = activeTab === "All" 
    ? universities 
    : universities?.filter(u => u.country === activeTab);

  return (
    <div className="pt-20">
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-blue-800 py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Partner Universities</h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              We have partnered with top-ranked universities globally to offer you the best educational programs and seamless admission processes.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-slate-50 min-h-[50vh]">
        <div className="container mx-auto px-4">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-center mb-12">
              <TabsList className="bg-white border border-slate-200 p-1 rounded-full overflow-x-auto flex flex-nowrap hide-scrollbar max-w-full">
                {countries.map(country => (
                  <TabsTrigger 
                    key={country} 
                    value={country}
                    className="rounded-full px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white whitespace-nowrap"
                  >
                    {country}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <TabsContent value={activeTab} className="mt-0 outline-none">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredUniversities?.length === 0 ? (
                    <div className="col-span-full text-center py-20 text-slate-500">
                      No universities found for this destination.
                    </div>
                  ) : (
                    filteredUniversities?.map(uni => (
                      <div key={uni.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col">
                        <div className="h-20 flex items-center justify-center mb-6 p-4">
                          {uni.logo ? (
                            <img src={uni.logo} alt={uni.name} className="max-h-full max-w-full object-contain" />
                          ) : (
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                              Logo
                            </div>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2 text-center">{uni.name}</h3>
                        <div className="flex items-center justify-center gap-2 text-slate-500 mb-4 text-sm">
                          <MapPin className="w-4 h-4" />
                          <span>{uni.country}</span>
                        </div>
                        {uni.description && (
                          <p className="text-sm text-slate-600 text-center mb-6 line-clamp-3">{uni.description}</p>
                        )}
                        <div className="mt-auto pt-4 flex justify-center">
                          {uni.website && (
                            <a href={uni.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 font-medium text-sm flex items-center gap-2">
                              <Globe className="w-4 h-4" /> Visit Website
                            </a>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </section>
    </div>
  );
}
