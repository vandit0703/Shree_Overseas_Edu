import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useCreateEnquiry } from "@workspace/api-client-react";

export default function Contact() {
  const { toast } = useToast();
  const createEnquiry = useCreateEnquiry();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    subject: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createEnquiry.mutate({ data: formData }, {
      onSuccess: () => {
        toast({ title: "Enquiry Sent", description: "We will get back to you shortly." });
        setFormData({ name: "", email: "", mobile: "", subject: "", message: "" });
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to send enquiry.", variant: "destructive" });
      }
    });
  };

  return (
    <div className="pt-20">
      <section className="bg-slate-900 py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Contact Us</h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Get in touch with our experts. We're here to answer all your queries regarding studying abroad.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            
            {/* Contact Info & Map */}
            <div className="space-y-12">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-8">Reach Out to Us</h2>
                <div className="space-y-6">
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">Head Office</h4>
                      <p className="text-slate-600">Gandhinagar, Gujarat, India</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">Phone</h4>
                      <p className="text-slate-600">+91 88497 90035</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">Email</h4>
                      <p className="text-slate-600">info@shreeoverseas.com</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl overflow-hidden h-[300px] border border-slate-200">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117466.90675276326!2d72.54877717646549!3d23.211475765668102!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395c2b8ba31c8eb1%3A0x628045610ec7e248!2sGandhinagar%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1709904265476!5m2!1sen!2sin" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* Form */}
            <div className="bg-slate-50 p-8 md:p-10 rounded-3xl border border-slate-100">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Send an Enquiry</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Name</label>
                  <Input required name="name" value={formData.name} onChange={handleChange} placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Email</label>
                  <Input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Your email address" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Mobile</label>
                  <Input required name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Your mobile number" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Subject</label>
                  <Input name="subject" value={formData.subject} onChange={handleChange} placeholder="What is this regarding?" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Message</label>
                  <Textarea required name="message" value={formData.message} onChange={handleChange} placeholder="Your message here..." rows={4} />
                </div>
                <Button type="submit" className="w-full h-12 text-lg rounded-full" disabled={createEnquiry.isPending}>
                  {createEnquiry.isPending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
