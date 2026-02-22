import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, ShieldCheck, Lock, Award, TrendingUp, TrendingDown, BarChart3, Activity } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { useSaudiExchangeTASI, useMarketBreadth } from "@/lib/api";
import { cn } from "@/lib/utils";
import { HandWrittenTitle } from "@/components/ui/hand-writing-text";

export default function Landing() {
    const { language, setLanguage } = useLanguage();
    const { data: tasi } = useSaudiExchangeTASI();
    const { data: breadth } = useMarketBreadth();

    const isAr = language === "ar";
    const toggleLanguage = () => setLanguage(isAr ? "en" : "ar");

    return (
        <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
            {/* Navigation */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                            S
                        </div>
                        <span className="text-xl font-bold tracking-tight">Saudi Quants</span>
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
                    {/* Subtle background glow */}
                    <div className="absolute inset-x-0  -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
                        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-accent opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
                    </div>

                    <div className="container mx-auto px-4 md:px-8">
                        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">

                            {/* Hero Left: Value Prop + Form */}
                            <div className={cn("max-w-2xl", isAr ? "lg:text-right" : "lg:text-left")}>
                                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 mb-6">
                                    {isAr ? "✨ منصة التحليل الكمي الأولى في المملكة" : "✨ The #1 Quantitative Platform in Saudi Arabia"}
                                </div>
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

                            {/* Hero Right: Live Stats Dashboard Mockup */}
                            <div className="relative mx-auto w-full max-w-lg lg:max-w-none group">
                                <div className="relative rounded-2xl border border-border/50 bg-card text-card-foreground shadow-2xl p-6 overflow-hidden transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,255,255,0.05)] hover:border-border">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 transition-opacity duration-300 group-hover:opacity-10">
                                        <BarChart3 className="w-40 h-40" />
                                    </div>
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="font-semibold text-lg">{isAr ? "مؤشرات السوق المباشرة" : "Live Market Pulse"}</h3>
                                        <span className="flex h-3 w-3">
                                            <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                        </span>
                                    </div>

                                    <div className="space-y-6 relative z-10">
                                        {/* TASI Live Card */}
                                        <div className="p-4 rounded-xl bg-secondary/50 border flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-muted-foreground font-medium mb-1">TASI {isAr ? "(تداول)" : "(Saudi Exchange)"}</p>
                                                <p className="text-3xl font-bold font-mono">
                                                    {tasi ? tasi.value.toLocaleString("en-US", { minimumFractionDigits: 2 }) : "11,850.42"}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <div className={cn("inline-flex items-center px-2 py-1 rounded-md text-sm font-bold", (tasi?.changePercent ?? 1) >= 0 ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500")}>
                                                    {(tasi?.changePercent ?? 1) >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                                                    {(tasi?.changePercent ?? 1) >= 0 ? "+" : ""}{(tasi?.changePercent ?? 0.85).toFixed(2)}%
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-1 text-right">
                                                    {(tasi?.change ?? 102.4).toFixed(2)} pts
                                                </p>
                                            </div>
                                        </div>

                                        {/* Breadth Live Card */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 rounded-xl bg-background border">
                                                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                                                    <TrendingUp className="h-3 w-3 text-green-500" />
                                                    {isAr ? "الشركات المرتفعة" : "Advancing"}
                                                </p>
                                                <p className="text-2xl font-bold text-green-500">{breadth ? breadth.advances : 142}</p>
                                            </div>
                                            <div className="p-4 rounded-xl bg-background border">
                                                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                                                    <TrendingDown className="h-3 w-3 text-red-500" />
                                                    {isAr ? "الشركات المنخفضة" : "Declining"}
                                                </p>
                                                <p className="text-2xl font-bold text-red-500">{breadth ? breadth.declines : 68}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Decorative blobs behind dashboard */}
                                <div className="absolute -inset-x-4 -inset-y-4 z-[-1] rounded-[3rem] bg-gradient-to-tr from-primary/10 via-transparent to-accent/10 blur-3xl opacity-50 transition-opacity duration-500 group-hover:opacity-100"></div>
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
                <section className="py-20 bg-primary/5 text-center">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold mb-6">
                            {isAr ? "جاهز لتغيير طريقة تداولك؟" : "Ready to transform your trading?"}
                        </h2>
                        <Link href="/dashboard">
                            <Button size="lg" className="h-12 px-8 text-base">
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
    );
}
