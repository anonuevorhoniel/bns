"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Heart,
    Users,
    BookOpen,
    Phone,
    Mail,
    MapPin,
    Apple,
    Utensils,
    Activity,
    Award,
    Calendar,
    FileText,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export default function Landing() {
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("animate-in");
                    }
                });
            },
            { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
        );

        const elements = document.querySelectorAll(".scroll-animate");
        elements.forEach((el) => observerRef.current?.observe(el));

        return () => observerRef.current?.disconnect();
    }, []);

    return (
        <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-slate-50 to-green-50 ">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
                <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                    <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-600">
                            <Heart className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-slate-900">
                                Provincial Nutrition Action Office
                            </h1>
                            {/* <p className="text-xs text-slate-600">
                                Promoting Health & Wellness
                            </p> */}
                        </div>
                    </div>
                    <nav className="hidden md:flex items-center space-x-6">
                        <Link
                            to="#services"
                            className="text-sm font-medium text-slate-700 hover:text-green-600 transition-colors"
                        >
                            Services
                        </Link>
                        <Link
                            to="#programs"
                            className="text-sm font-medium text-slate-700 hover:text-green-600 transition-colors"
                        >
                            Programs
                        </Link>
                        <Link
                            to="#about"
                            className="text-sm font-medium text-slate-700 hover:text-green-600 transition-colors"
                        >
                            About
                        </Link>
                        <Link
                            to="#contact"
                            className="text-sm font-medium text-slate-700 hover:text-green-600 transition-colors"
                        >
                            Contact
                        </Link>
                        <Link
                            to="#contact"
                            className="text-sm font-medium text-slate-700 hover:text-green-600 transition-colors"
                        >
                            Contact
                        </Link>
                        <Link
                            to="/login"
                            className="text-sm font-medium text-slate-700 hover:text-green-600 transition-colors"
                        >
                            Login
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative w-full py-20 md:py-32 hero-gradient overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1200')] bg-cover bg-center opacity-5"></div>
                    <div className="container relative px-4 md:px-6">
                        <div className="flex flex-col items-center space-y-8 text-center">
                            <Badge
                                variant="secondary"
                                className="bg-green-100 text-green-800 border-green-200"
                            >
                                Serving Our Community Since 1995
                            </Badge>
                            <div className="space-y-4 max-w-4xl">
                                <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-7xl">
                                    Nourishing 
                                    <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                        {" "}
                                        Laguna
                                    </span>
                                </h1>
                                <p className="mx-auto max-w-2xl text-lg text-slate-600 md:text-xl">
                                    Dedicated to improving the nutritional
                                    status and health outcomes of our
                                    communities through evidence-based programs,
                                    education, and comprehensive support
                                    services.
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button
                                    size="lg"
                                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                                >
                                    <Calendar className="mr-2 h-5 w-5" />
                                    Schedule Consultation
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="border-slate-300 hover:bg-slate-50"
                                >
                                    <FileText className="mr-2 h-5 w-5" />
                                    View Resources
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Services Section */}
                <section id="services" className="w-full py-20 bg-white">
                    <div className="container px-4 md:px-6">
                        <div className="scroll-animate text-center mb-16">
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
                                Our Services
                            </h2>
                            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                                Comprehensive nutrition services designed to
                                support individuals, families, and communities
                            </p>
                        </div>

                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            <Card className="scroll-animate service-gradient border-green-100 hover:shadow-lg transition-all duration-300">
                                <CardHeader>
                                    <div className="flex items-center space-x-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500">
                                            <Apple className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-slate-900">
                                                Nutrition Assessment
                                            </CardTitle>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-slate-600">
                                        Comprehensive nutritional evaluations
                                        and personalized dietary recommendations
                                        for optimal health outcomes.
                                    </CardDescription>
                                </CardContent>
                            </Card>

                            <Card className="scroll-animate service-gradient border-green-100 hover:shadow-lg transition-all duration-300">
                                <CardHeader>
                                    <div className="flex items-center space-x-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500">
                                            <Users className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-slate-900">
                                                Community Programs
                                            </CardTitle>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-slate-600">
                                        Educational workshops, cooking classes,
                                        and community outreach programs to
                                        promote healthy eating habits.
                                    </CardDescription>
                                </CardContent>
                            </Card>

                            <Card className="scroll-animate service-gradient border-green-100 hover:shadow-lg transition-all duration-300">
                                <CardHeader>
                                    <div className="flex items-center space-x-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500">
                                            <BookOpen className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-slate-900">
                                                Education & Training
                                            </CardTitle>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-slate-600">
                                        Professional development programs for
                                        healthcare providers and nutrition
                                        education for the public.
                                    </CardDescription>
                                </CardContent>
                            </Card>

                            <Card className="scroll-animate service-gradient border-green-100 hover:shadow-lg transition-all duration-300">
                                <CardHeader>
                                    <div className="flex items-center space-x-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500">
                                            <Utensils className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-slate-900">
                                                Meal Planning
                                            </CardTitle>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-slate-600">
                                        Customized meal planning services for
                                        individuals with specific dietary needs
                                        and health conditions.
                                    </CardDescription>
                                </CardContent>
                            </Card>

                            <Card className="scroll-animate service-gradient border-green-100 hover:shadow-lg transition-all duration-300">
                                <CardHeader>
                                    <div className="flex items-center space-x-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-500">
                                            <Activity className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-slate-900">
                                                Health Monitoring
                                            </CardTitle>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-slate-600">
                                        Regular health screenings and monitoring
                                        programs to track nutritional progress
                                        and outcomes.
                                    </CardDescription>
                                </CardContent>
                            </Card>

                            <Card className="scroll-animate service-gradient border-green-100 hover:shadow-lg transition-all duration-300">
                                <CardHeader>
                                    <div className="flex items-center space-x-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-500">
                                            <Award className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-slate-900">
                                                Certification Programs
                                            </CardTitle>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-slate-600">
                                        Professional certification and
                                        continuing education programs for
                                        nutrition and health professionals.
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Programs Section */}
                <section
                    id="programs"
                    className="w-full py-20 bg-gradient-to-br from-slate-50 to-blue-50"
                >
                    <div className="container px-4 md:px-6">
                        <div className="scroll-animate text-center mb-16">
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
                                Featured Programs
                            </h2>
                            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                                Specialized initiatives addressing the unique
                                nutritional needs of our diverse communities
                            </p>
                        </div>

                        <div className="grid gap-8 lg:grid-cols-2">
                            <div className="scroll-animate">
                                <Card className="h-full bg-white border-slate-200 hover:shadow-xl transition-all duration-300">
                                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                                        {/* <Image
                      src="/placeholder.svg?height=300&width=500"
                      alt="Maternal & Child Nutrition Program"
                      width={500}
                      height={300}
                      className="object-cover w-full h-full"
                    /> */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                    </div>
                                    <CardHeader>
                                        <CardTitle className="text-xl text-slate-900">
                                            Maternal & Child Nutrition
                                        </CardTitle>
                                        <CardDescription className="text-slate-600">
                                            Comprehensive support for pregnant
                                            mothers, new parents, and children
                                            from birth to 5 years, ensuring
                                            proper nutrition during critical
                                            development stages.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            <Badge
                                                variant="secondary"
                                                className="bg-pink-100 text-pink-800"
                                            >
                                                Prenatal Care
                                            </Badge>
                                            <Badge
                                                variant="secondary"
                                                className="bg-blue-100 text-blue-800"
                                            >
                                                Child Development
                                            </Badge>
                                            <Badge
                                                variant="secondary"
                                                className="bg-green-100 text-green-800"
                                            >
                                                Family Support
                                            </Badge>
                                        </div>
                                        <Button className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600">
                                            Learn More
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="scroll-animate">
                                <Card className="h-full bg-white border-slate-200 hover:shadow-xl transition-all duration-300">
                                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                                        {/* <Image
                      src="/placeholder.svg?height=300&width=500"
                      alt="Senior Nutrition Program"
                      width={500}
                      height={300}
                      className="object-cover w-full h-full"
                    /> */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                    </div>
                                    <CardHeader>
                                        <CardTitle className="text-xl text-slate-900">
                                            Senior Nutrition Initiative
                                        </CardTitle>
                                        <CardDescription className="text-slate-600">
                                            Specialized nutrition programs for
                                            seniors, focusing on maintaining
                                            health, independence, and quality of
                                            life through proper nutrition and
                                            social engagement.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            <Badge
                                                variant="secondary"
                                                className="bg-purple-100 text-purple-800"
                                            >
                                                Meal Delivery
                                            </Badge>
                                            <Badge
                                                variant="secondary"
                                                className="bg-orange-100 text-orange-800"
                                            >
                                                Health Monitoring
                                            </Badge>
                                            <Badge
                                                variant="secondary"
                                                className="bg-teal-100 text-teal-800"
                                            >
                                                Social Programs
                                            </Badge>
                                        </div>
                                        <Button className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600">
                                            Learn More
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section id="about" className="w-full py-20 bg-white">
                    <div className="container px-4 md:px-6">
                        <div className="grid gap-12 lg:grid-cols-1 lg:gap-16 items-center">
                            <div className="scroll-animate">
                                <div className="space-y-6 flex flex-col items-center">
                                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                                        About Our Office
                                    </h2>
                                    <p className="text-lg text-slate-600">
                                        For over 25 years, the Provincial
                                        Nutrition Office has been at the
                                        forefront of promoting health and
                                        wellness throughout our province. Our
                                        dedicated team of registered dietitians,
                                        nutritionists, and health professionals
                                        work tirelessly to ensure that every
                                        resident has access to quality nutrition
                                        services and education.
                                    </p>
                                    <p className="text-lg text-slate-600">
                                        We believe that proper nutrition is the
                                        foundation of good health and a thriving
                                        community. Through our evidence-based
                                        programs and collaborative approach,
                                        we've helped thousands of families
                                        improve their nutritional status and
                                        overall well-being.
                                    </p>
                                    <div className="grid grid-cols-2 gap-6 pt-6">
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-green-600">
                                                25+
                                            </div>
                                            <div className="text-sm text-slate-600">
                                                Years of Service
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-blue-600">
                                                50,000+
                                            </div>
                                            <div className="text-sm text-slate-600">
                                                Families Served
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-purple-600">
                                                15
                                            </div>
                                            <div className="text-sm text-slate-600">
                                                Expert Staff
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-orange-600">
                                                100+
                                            </div>
                                            <div className="text-sm text-slate-600">
                                                Programs Offered
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="scroll-animate">
                                <div className="relative">
                                    {/* <Image
                    src="/placeholder.svg?height=500&width=600"
                    alt="Our team at work"
                    width={600}
                    height={500}
                    className="rounded-lg shadow-lg object-cover"
                  /> */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-green-500/10 to-blue-500/10 rounded-lg"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section
                    id="contact"
                    className="w-full py-20 bg-gradient-to-br from-slate-900 to-slate-800 text-white"
                >
                    <div className="container px-4 md:px-6">
                        <div className="scroll-animate text-center mb-16">
                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                                Get In Touch
                            </h2>
                            <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">
                                Ready to start your journey to better nutrition?
                                Contact us today to learn more about our
                                services.
                            </p>
                        </div>

                        <div className="grid gap-8 md:grid-cols-3">
                            <Card className="scroll-animate bg-white/10 border-white/20 text-white">
                                <CardHeader className="text-center">
                                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500">
                                        <Phone className="h-8 w-8" />
                                    </div>
                                    <CardTitle>Phone</CardTitle>
                                </CardHeader>
                                <CardContent className="text-center">
                                    <p className="text-slate-300">
                                        (555) 123-4567
                                    </p>
                                    <p className="text-sm text-slate-400 mt-2">
                                        Mon-Fri, 8AM-5PM
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="scroll-animate bg-white/10 border-white/20 text-white">
                                <CardHeader className="text-center">
                                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-500">
                                        <Mail className="h-8 w-8" />
                                    </div>
                                    <CardTitle>Email</CardTitle>
                                </CardHeader>
                                <CardContent className="text-center">
                                    <p className="text-slate-300">
                                        info@provincialnutrition.gov
                                    </p>
                                    <p className="text-sm text-slate-400 mt-2">
                                        We respond within 24 hours
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="scroll-animate bg-white/10 border-white/20 text-white">
                                <CardHeader className="text-center">
                                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-500">
                                        <MapPin className="h-8 w-8" />
                                    </div>
                                    <CardTitle>Location</CardTitle>
                                </CardHeader>
                                <CardContent className="text-center">
                                    <p className="text-slate-300">
                                        123 Health Plaza, Suite 200
                                    </p>
                                    <p className="text-slate-300">
                                        Provincial Capital, PC 12345
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="scroll-animate text-center mt-12">
                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                            >
                                <Calendar className="mr-2 h-5 w-5" />
                                Schedule Your Consultation Today
                            </Button>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="w-full py-8 bg-slate-900 text-white border-t border-slate-800">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center space-x-3 mb-4 md:mb-0">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-600">
                                <Heart className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-lg font-semibold">
                                Provincial Nutrition Office
                            </span>
                        </div>
                        <p className="text-sm text-slate-400">
                            © {new Date().getFullYear()} Provincial Nutrition
                            Office. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
