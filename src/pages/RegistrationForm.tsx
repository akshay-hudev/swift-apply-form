import { useState, useRef, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  course: string;
  address: string;
}

interface FormErrors {
  [key: string]: boolean;
}

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    course: "",
    address: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Load editing data if exists
  useEffect(() => {
    const editingData = localStorage.getItem("editingSubmission");
    if (editingData) {
      const data = JSON.parse(editingData);
      setFormData({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        gender: data.gender,
        course: data.course,
        address: data.address,
      });
      setIsEditing(true);
      setEditingId(data.id);
      localStorage.removeItem("editingSubmission");
    }
  }, []);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone: string) => {
    const re = /^[0-9]{10}$/;
    return re.test(phone.replace(/[-\s]/g, ""));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = true;
    }

    if (!formData.email.trim() || !validateEmail(formData.email)) {
      newErrors.email = true;
    }

    if (!formData.phone.trim() || !validatePhone(formData.phone)) {
      newErrors.phone = true;
    }

    if (!formData.gender) {
      newErrors.gender = true;
    }

    if (!formData.course) {
      newErrors.course = true;
    }

    if (!formData.address.trim()) {
      newErrors.address = true;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      // Scroll to first error
      setTimeout(() => {
        const firstErrorKey = Object.keys(newErrors)[0];
        const element = document.getElementById(firstErrorKey);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
      return false;
    }

    return true;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Save to localStorage
    const existingData = JSON.parse(localStorage.getItem("registrations") || "[]");
    
    if (isEditing && editingId) {
      // Update existing entry
      const updatedData = existingData.map((entry: any) =>
        entry.id === editingId
          ? { ...entry, ...formData, submittedAt: new Date().toISOString() }
          : entry
      );
      localStorage.setItem("registrations", JSON.stringify(updatedData));
      localStorage.setItem("lastSubmission", JSON.stringify({ ...formData, id: editingId, submittedAt: new Date().toISOString() }));
    } else {
      // Create new entry
      const newEntry = {
        ...formData,
        id: Date.now(),
        submittedAt: new Date().toISOString(),
      };
      existingData.push(newEntry);
      localStorage.setItem("registrations", JSON.stringify(existingData));
      localStorage.setItem("lastSubmission", JSON.stringify(newEntry));
    }

    // Navigate to success page
    navigate("/success");
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Remove error when user starts typing - force re-render to retrigger animation
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Force animation retrigger by temporarily removing classes
  const getFieldClassName = (field: keyof FormData, baseClass: string) => {
    if (errors[field]) {
      // Use key or force reflow to retrigger animation
      setTimeout(() => {
        const element = document.getElementById(field);
        if (element) {
          element.classList.remove('shake');
          void element.offsetWidth; // Force reflow
          element.classList.add('shake');
        }
      }, 0);
      return `${baseClass} invalid shake`;
    }
    return baseClass;
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Top Bar */}
        <div className="bg-primary text-primary-foreground py-4 px-6 rounded-t-lg mb-0">
          <h1 className="text-2xl font-bold">
            {isEditing ? "Edit Application" : "Online Application Form"}
          </h1>
          <p className="text-sm opacity-90">
            {isEditing ? "Update your registration details" : "Fill out the form below to register"}
          </p>
        </div>

        {/* Form Card */}
        <Card className="p-8 rounded-t-none shadow-lg">
          <form ref={formRef} onSubmit={handleSubmit} noValidate>
            <div className="space-y-6">
              {/* Full Name */}
              <div>
                <Label htmlFor="fullName" className="text-base font-semibold">
                  Full Name *
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  className={getFieldClassName("fullName", "mt-2")}
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" className="text-base font-semibold">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={getFieldClassName("email", "mt-2")}
                  placeholder="example@email.com"
                />
              </div>

              {/* Phone */}
              <div>
                <Label htmlFor="phone" className="text-base font-semibold">
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className={getFieldClassName("phone", "mt-2")}
                  placeholder="1234567890"
                />
              </div>

              {/* Gender */}
              <div>
                <Label htmlFor="gender" className="text-base font-semibold">
                  Gender *
                </Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleInputChange("gender", value)}
                >
                  <SelectTrigger
                    id="gender"
                    className={getFieldClassName("gender", "mt-2")}
                  >
                    <SelectValue placeholder="Select your gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Course */}
              <div>
                <Label htmlFor="course" className="text-base font-semibold">
                  Course Applying For *
                </Label>
                <Select
                  value={formData.course}
                  onValueChange={(value) => handleInputChange("course", value)}
                >
                  <SelectTrigger
                    id="course"
                    className={getFieldClassName("course", "mt-2")}
                  >
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web-development">Web Development</SelectItem>
                    <SelectItem value="data-science">Data Science</SelectItem>
                    <SelectItem value="mobile-app">Mobile App Development</SelectItem>
                    <SelectItem value="ui-ux-design">UI/UX Design</SelectItem>
                    <SelectItem value="digital-marketing">Digital Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Address */}
              <div>
                <Label htmlFor="address" className="text-base font-semibold">
                  Address *
                </Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className={getFieldClassName("address", "mt-2 min-h-[100px]")}
                  placeholder="Enter your complete address"
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1 text-lg py-6">
                  {isEditing ? "Update Application" : "Submit Application"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/view")}
                  className="flex-1 text-lg py-6"
                >
                  View All Submissions
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default RegistrationForm;
