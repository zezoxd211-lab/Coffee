import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, ShieldCheck, Lock, Award, TrendingUp, TrendingDown, BarChart3, Activity } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { useSaudiExchangeTASI, useMarketBreadth, useMarketNews } from "@/lib/api";
import { cn } from "@/lib/utils";
import { HandWrittenTitle } from "@/components/ui/hand-writing-text";
import { ShaderAnimation } from "@/components/ui/shader-animation";
import { InteractiveBackground } from "@/components/ui/interactive-background";

export default function Landing() {
    const { language, setLanguage } = useLanguage();
    const { data: tasi } = useSaudiExchangeTASI();
    const { data: breadth } = useMarketBreadth();
    const { data: news } = useMarketNews();

    const isAr = language === "ar";
    const toggleLanguage = () => setLanguage(isAr ? "en" : "ar");

    return (
        <div className="min-h-screen relative font-sans selection:bg-primary/20 overflow-hidden text-white">
            <InteractiveBackground scheme={1} />
            <div className="relative z-10 flex flex-col min-h-screen">
                {/* Navigation */}
                <header className="sticky top-0 z-50 w-full border-b bg-background/20 backdrop-blur-md supports-[backdrop-filter]:bg-background/20">
                    <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                                S
                            </div>
                            <span className="text-xl font-bold tracking-tight">live 92</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <button onClick={toggleLanguage} className="text-sm font-medium hover:text-primary transition-colors">
                                {isAr ? "English" : "العربية"}
                            </button>
                            <Link href="/dashboard">
                                <Button variant="ghost" className="hidden md:flex">{isAr ? "دخول" : "Log In"}</Button>
                            </Link>
                            <Link href="/dashboard">
                                <Button>{isAr ? "ابدأ مجاناً" : "Start Free"}</Button>
                            </Link>
                        </div>
                    </div>
                </header>

                <main className="flex-1">
                    {/* Split Hero Section */}
                    <section className="relative overflow-hidden py-20 lg:py-32">

                        <div className="container mx-auto px-4 md:px-8">
                            <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">

                                {/* Hero Left: Value Prop + Form */}
                                <div className={cn("max-w-2xl", isAr ? "lg:text-right" : "lg:text-left")}>
                                    <div className="mb-4">
                                        <HandWrittenTitle
                                            title={isAr ? "تداول بذكاء في السـوق السـعـودي" : "Trade Smarter in the Saudi Market"}
                                            subtitle={isAr
                                                ? "احصل على بيانات فورية، تحليلات كمية متقدمة، وأدوات احترافية مدعومة بالذكاء الاصطناعي لاتخاذ قرارات استثمارية دقيقة وثقة تامة."
                                                : "Get real-time data, advanced quantitative analytics, and professional AI-powered tools to make precise and confident investment decisions."}
                                        />
                                    </div>

                                    {/* Conversion Form */}
                                    <div className="flex flex-col sm:flex-row gap-3 max-w-md">
                                        <Input
                                            type="email"
                                            placeholder={isAr ? "أدخل بريدك الإلكتروني" : "Enter your email"}
                                            className="h-12 text-base"
                                        />
                                        <Link href="/dashboard">
                                            <Button size="lg" className="h-12 w-full sm:w-auto text-base shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all duration-300 hover:-translate-y-0.5">
                                                {isAr ? "ابدأ تجربتك المجانية" : "Start Free Trial"}
                                            </Button>
                                        </Link>
                                    </div>

                                    <p className="mt-4 text-xs text-muted-foreground flex items-center gap-2">
                                        <ShieldCheck className="h-4 w-4 text-green-500" />
                                        {isAr ? "لا نطلب بطاقة ائتمان. مدعوم بتشفير بنكي 256-bit." : "No credit card required. Bank-level 256-bit encryption."}
                                    </p>
                                </div>

                                {/* Hero Right: Market Stats & News Dashboard */}
                                <div className="relative mx-auto w-full max-w-lg lg:max-w-none group flex flex-col gap-6">
                                    <div className="relative rounded-2xl border border-border/50 bg-background/20 backdrop-blur-xl text-card-foreground shadow-2xl p-6 overflow-hidden transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,255,255,0.05)] hover:border-border">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-semibold text-lg text-white">{isAr ? "مؤشرات السوق المباشرة" : "Live Market Pulse"}</h3>
                                            <span className="flex h-3 w-3">
                                                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                                            {/* TASI Live Card */}
                                            <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex flex-col justify-between">
                                                <div>
                                                    <p className="text-sm text-white/70 font-medium mb-1">TASI {isAr ? "(تداول)" : "(Saudi Exchange)"}</p>
                                                    <p className="text-3xl font-bold font-mono text-white">
                                                        {tasi ? tasi.value.toLocaleString("en-US", { minimumFractionDigits: 2 }) : "11,850.42"}
                                                    </p>
                                                </div>
                                                <div className="mt-4 flex justify-between items-end">
                                                    <div className={cn("inline-flex items-center px-2 py-1 rounded-md text-sm font-bold", (tasi?.changePercent ?? 1) >= 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400")}>
                                                        {(tasi?.changePercent ?? 1) >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                                                        {(tasi?.changePercent ?? 1) >= 0 ? "+" : ""}{(tasi?.changePercent ?? 0.85).toFixed(2)}%
                                                    </div>
                                                    <p className="text-xs text-white/50 text-right">
                                                        {(tasi?.change ?? 102.4).toFixed(2)} pts
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Breadth Live Card */}
                                            <div className="flex flex-col gap-2">
                                                <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                                                    <p className="text-sm text-white/70 flex items-center gap-2">
                                                        <TrendingUp className="h-4 w-4 text-green-400" />
                                                        {isAr ? "المرتفعة" : "Advancing"}
                                                    </p>
                                                    <p className="text-2xl font-bold text-green-400 font-mono">{breadth ? breadth.advances : 142}</p>
                                                </div>
                                                <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                                                    <p className="text-sm text-white/70 flex items-center gap-2">
                                                        <TrendingDown className="h-4 w-4 text-red-400" />
                                                        {isAr ? "المنخفضة" : "Declining"}
                                                    </p>
                                                    <p className="text-2xl font-bold text-red-400 font-mono">{breadth ? breadth.declines : 68}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Market News Section */}
                                    <div className="relative rounded-2xl border border-border/50 bg-background/20 backdrop-blur-xl shadow-2xl overflow-hidden transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,255,255,0.05)] hover:border-border">
                                        <div className="p-4 border-b border-white/5 bg-black/20 flex items-center gap-2">
                                            <div className="h-3 w-3 rounded-full bg-red-500"></div>
                                            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                                            <div className="h-3 w-3 rounded-full bg-green-500"></div>
                                            <span className="ml-2 text-sm font-medium text-white/80">{isAr ? "أخبار السوق المباشرة" : "Live Market News"}</span>
                                        </div>
                                        <div className="p-4 flex flex-col gap-3 max-h-[250px] overflow-y-auto custom-scrollbar">
                                            {(news ? news.slice(0, 4) : Array(4).fill(null)).map((item, idx) => (
                                                <div key={item?.id || idx} className="p-3 rounded-lg bg-black/40 hover:bg-black/60 transition-colors border border-white/5">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <p className="text-xs text-primary font-medium">{item?.category || "Tadawul"}</p>
                                                        <p className="text-xs text-white/50">{item?.date || "Just now"}</p>
                                                    </div>
                                                    <h4 className="text-sm font-semibold text-white/90 line-clamp-2">
                                                        {item ? (isAr ? item.titleAr : item.title) : (isAr ? "جاري تحميل أخبار السوق..." : "Loading market news...")}
                                                    </h4>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Decorative blobs behind dashboard */}
                                    <div className="absolute -inset-x-4 -inset-y-4 z-[-1] rounded-[3rem] bg-gradient-to-tr from-primary/10 via-transparent to-accent/10 blur-3xl opacity-50 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none"></div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Trust Indicators Section */}
                    <section className="py-12 border-y bg-secondary/30">
                        <div className="container mx-auto px-4">
                            <p className="text-center text-sm font-semibold text-muted-foreground mb-8 uppercase tracking-wider">
                                {isAr ? "موثوق من قبل أفضل المتداولين في السعودية" : "Trusted by top traders across Saudi Arabia"}
                            </p>
                            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70 grayscale">
                                {/* Dummy partner logos using lucid-react icons as placeholders */}
                                <div className="flex items-center gap-2 font-bold text-xl"><Activity className="h-6 w-6" /> Al-Rajhi Capital</div>
                                <div className="flex items-center gap-2 font-bold text-xl"><ShieldCheck className="h-6 w-6" /> SNB Capital</div>
                                <div className="flex items-center gap-2 font-bold text-xl"><Award className="h-6 w-6" /> CMA Compliant</div>
                                <div className="flex items-center gap-2 font-bold text-xl"><Lock className="h-6 w-6" /> 256-bit Secure</div>
                            </div>
                        </div>
                    </section>

                    {/* Transparent Pricing Section */}
                    <section className="py-20 lg:py-32">
                        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                                    {isAr ? "تسعير شفاف وبدون مفاجآت" : "Transparent Pricing, No Surprises"}
                                </h2>
                                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                    {isAr
                                        ? "اختر الباقة التي تناسب حجم استثماراتك. يمكنك الترقية أو الإلغاء في أي وقت."
                                        : "Choose the plan that fits your trading volume. Upgrade or cancel anytime with zero hidden fees."}
                                </p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-8">
                                {/* Basic Plan */}
                                <div className="rounded-2xl border bg-card p-8 shadow-sm flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/50">
                                    <h3 className="text-xl font-semibold mb-2">{isAr ? "الأساسي" : "Basic"}</h3>
                                    <div className="mb-4">
                                        <span className="text-4xl font-bold">Free</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-6 flex-1">
                                        {isAr ? "مثالي للمبتدئين الذين يريدون متابعة السوق." : "Perfect for beginners exploring the Saudi market."}
                                    </p>
                                    <ul className="space-y-3 mb-8 text-sm">
                                        {[
                                            isAr ? "أسعار متأخرة 15 دقيقة" : "15-min delayed prices",
                                            isAr ? "تحليل شركتين يومياً" : "Analyze 2 companies / day",
                                            isAr ? "أخبار السوق الأساسية" : "Basic market news",
                                        ].map((feature, i) => (
                                            <li key={i} className="flex items-center gap-3">
                                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <Link href="/dashboard" className="w-full mt-auto">
                                        <Button variant="outline" className="w-full">{isAr ? "ابدأ مجاناً" : "Start Free"}</Button>
                                    </Link>
                                </div>

                                {/* Pro Plan */}
                                <div className="rounded-2xl border-2 border-primary bg-card p-8 shadow-[0_0_30px_rgba(255,255,255,0.03)] relative flex flex-col transform md:-translate-y-4 transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,255,255,0.08)] hover:-translate-y-5">
                                    <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full shadow-sm">
                                        {isAr ? "الأكثر مبيعاً" : "MOST POPULAR"}
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">{isAr ? "المحترف" : "Pro"}</h3>
                                    <div className="mb-4 flex items-baseline">
                                        <span className="text-4xl font-bold">149 ﷼</span>
                                        <span className="text-muted-foreground ml-2">/{isAr ? "شهر" : "mo"}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-6 flex-1">
                                        {isAr ? "للمتداولين النشطين الباحثين عن التفوق." : "For active traders looking for an edge."}
                                    </p>
                                    <ul className="space-y-3 mb-8 text-sm">
                                        {[
                                            isAr ? "أسعار لحظية مباشرة" : "Real-time live prices",
                                            isAr ? "تحليلات كمية غير محدودة" : "Unlimited quant analysis",
                                            isAr ? "منبهات أسعار ذكية" : "Smart price alerts",
                                            isAr ? "حاسبة القيمة العادلة (DCF)" : "DCF Fair Value Calculator",
                                        ].map((feature, i) => (
                                            <li key={i} className="flex items-center gap-3">
                                                <CheckCircle2 className="h-5 w-5 text-primary" />
                                                <span className="font-medium">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <Link href="/dashboard" className="w-full mt-auto">
                                        <Button className="w-full">{isAr ? "اشترك الآن" : "Subscribe Now"}</Button>
                                    </Link>
                                </div>

                                {/* Enterprise Plan */}
                                <div className="rounded-2xl border bg-card p-8 shadow-sm flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/50">
                                    <h3 className="text-xl font-semibold mb-2">{isAr ? "المؤسسات" : "Enterprise"}</h3>
                                    <div className="mb-4 flex items-baseline">
                                        <span className="text-4xl font-bold">499 ﷼</span>
                                        <span className="text-muted-foreground ml-2">/{isAr ? "شهر" : "mo"}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-6 flex-1">
                                        {isAr ? "لصناديق الاستثمار والشركات المالية." : "For funds and institutional investors."}
                                    </p>
                                    <ul className="space-y-3 mb-8 text-sm">
                                        {[
                                            isAr ? "الوصول المباشر لـ API" : "Direct API Access",
                                            isAr ? "مدير حساب شخصي" : "Dedicated account manager",
                                            isAr ? "بيانات تاريخية +10 سنوات" : "10+ years historical data",
                                        ].map((feature, i) => (
                                            <li key={i} className="flex items-center gap-3">
                                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <Link href="/dashboard" className="w-full mt-auto">
                                        <Button variant="outline" className="w-full">{isAr ? "تواصل معنا" : "Contact Sales"}</Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Footer CTA */}
                    <section className="relative py-24 text-center overflow-hidden border-t">
                        <div className="absolute inset-0 z-0">
                            <ShaderAnimation />
                        </div>
                        {/* Dark gradient overlay to ensure text readability over the shader */}
                        <div className="absolute inset-0 bg-background/80 md:bg-background/60 z-0 backdrop-blur-[2px]"></div>

                        <div className="container relative mx-auto px-4 z-10 flex flex-col items-center justify-center">
                            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
                                {isAr ? "جاهز لتغيير طريقة تداولك؟" : "Ready to transform your trading?"}
                            </h2>
                            <p className="text-xl text-muted-foreground mb-8 max-w-2xl text-center">
                                {isAr ? "انضم إلى آلاف المحترفين واستفد من قوة البيانات الكمية المباشرة." : "Join thousands of professionals and tap into the power of live quantitative data."}
                            </p>
                            <Link href="/dashboard">
                                <Button size="lg" className="h-14 px-10 text-lg shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.25)] transition-all duration-300 hover:-translate-y-1 rounded-full">
                                    {isAr ? "انضم إلى 10,000+ متداول اليوم" : "Join 10,000+ traders today"}
                                </Button>
                            </Link>
                        </div>
                    </section>
                </main>

                {/* Simple Footer */}
                <footer className="border-t py-8 md:py-12 bg-background">
                    <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                        <p>© {new Date().getFullYear()} Saudi Quants. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        </div>
    );
}
