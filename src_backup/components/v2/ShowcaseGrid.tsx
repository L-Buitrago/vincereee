import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    number: "01",
    title: "Vincere Platform",
    category: "Software Development",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070",
    color: "bg-[#dfe6e5]",
  },
  {
    number: "02",
    title: "AI Automation",
    category: "Machine Learning",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2072",
    color: "bg-[#0F172A] text-white",
  },
  {
    number: "03",
    title: "Eco Branding",
    category: "Digital Strategy",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=2071",
    color: "bg-[#DBEAFE]",
  }
];

const ShowcaseGrid = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {projects.map((project, index) => (
          <motion.div 
            key={project.number}
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className={`group relative mb-12 rounded-[40px] overflow-hidden ${project.color} min-h-[500px] flex flex-col md:flex-row shadow-sm hover:shadow-2xl transition-all duration-700`}
          >
            {/* Project Info */}
            <div className="p-12 flex flex-col justify-between flex-1 relative z-20">
              <div className="flex justify-between items-start">
                 <span className="text-4xl font-serif italic opacity-30">{project.number}</span>
                 <div className="w-16 h-16 rounded-full border border-current flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-all duration-500">
                    <ArrowUpRight className="w-6 h-6" />
                 </div>
              </div>
              
              <div>
                <p className="text-xs font-sans font-bold uppercase tracking-[0.3em] opacity-40 mb-2">{project.category}</p>
                <h3 className="text-5xl md:text-7xl font-sans font-extrabold tracking-tighter">{project.title}</h3>
              </div>
            </div>

            {/* Project Media */}
            <div className="flex-1 relative overflow-hidden">
               <motion.img 
                  src={project.image} 
                  alt={project.title}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 1 }}
                  className="w-full h-full object-cover"
               />
               <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ShowcaseGrid;
