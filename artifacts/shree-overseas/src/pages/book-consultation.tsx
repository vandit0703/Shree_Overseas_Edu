import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useCreateConsultation } from "@workspace/api-client-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function BookConsultation() {
  const { toast } = useToast();
  const createConsultation = useCreateConsultation();
  
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    preferredCountry: "",
    courseInterest: "",
    preferredDate: "",
    preferredTime: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createConsultation.mutate({ data: formData }, {
      onSuccess: () => {
        toast({
          title: "Booking Confirmed",
          description: "We have received your consultation request. Our team will contact you shortly.",
        });
        setFormData({
          fullName: "",
          mobile: "",
          email: "",
          preferredCountry: "",
          courseInterest: "",
          preferredDate: "",
          preferredTime: "",
          message: ""
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "There was a problem submitting your request. Please try again.",
          variant: "destructive"
        });
      }
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-slate-50">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-primary px-8 py-10 text-white text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">Book Free Consultation</h1>
            <p className="text-primary-foreground/80 max-w-xl mx-auto">
              Take the first step towards your international education journey. Fill out the form below and our expert counselors will get in touch with you.
            </p>
          </div>
          
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Full Name</label>
                  <Input required name="fullName" value={formData.fullName} onChange={handleChange} placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Mobile Number</label>
                  <Input required name="mobile" value={formData.mobile} onChange={handleChange} placeholder="+91 XXXXX XXXXX" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Email Address</label>
                  <Input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Preferred Country</label>
                  <Select onValueChange={(val) => handleSelectChange("preferredCountry", val)} value={formData.preferredCountry}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Canada">Canada</SelectItem>
                      <SelectItem value="USA">USA</SelectItem>
                      <SelectItem value="UK">UK</SelectItem>
                      <SelectItem value="Australia">Australia</SelectItem>
                      <SelectItem value="New Zealand">New Zealand</SelectItem>
                      <SelectItem value="Europe">Europe</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Course of Interest</label>
                <Input required name="courseInterest" value={formData.courseInterest} onChange={handleChange} placeholder="e.g. Master's in Computer Science" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Preferred Date</label>
                  <Input required type="date" name="preferredDate" value={formData.preferredDate} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Preferred Time</label>
                  <Input required type="time" name="preferredTime" value={formData.preferredTime} onChange={handleChange} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Additional Message (Optional)</label>
                <Textarea name="message" value={formData.message} onChange={handleChange} placeholder="Any specific questions or requirements?" rows={4} />
              </div>

              <Button type="submit" className="w-full h-12 text-lg" disabled={createConsultation.isPending}>
                {createConsultation.isPending ? "Submitting..." : "Book Free Consultation"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
