import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-background py-20 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Your Trusted <span className="text-primary">Home Service</span> Platform
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
            Book qualified professionals for repairs, cleaning, plumbing, and more. Fast, reliable, and affordable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/services"
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Browse Services
            </Link>
            <Link
              href="/register"
              className="px-8 py-3 border border-primary text-primary rounded-lg font-semibold hover:bg-primary/10 transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 border-y bg-muted/20">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "500+", label: "Service Experts" },
              { value: "10k+", label: "Happy Customers" },
              { value: "50+", label: "Service Types" },
              { value: "4.9★", label: "Average Rating" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Choose a Service", desc: "Browse our wide range of home services and pick what you need." },
              { step: "02", title: "Book a Technician", desc: "Select a qualified technician and pick an available time slot." },
              { step: "03", title: "Get It Done", desc: "Your technician arrives, completes the job, and you pay securely." },
            ].map((item) => (
              <div key={item.step} className="text-center p-6 rounded-xl border bg-card hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center max-w-xl">
          <h2 className="text-3xl font-bold mb-4">Ready to fix it now?</h2>
          <p className="mb-8 text-primary-foreground/80">
            Join thousands of satisfied customers who trust FixItNow.
          </p>
          <Link
            href="/services"
            className="px-8 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-white/90 transition-colors"
          >
            View All Services
          </Link>
        </div>
      </section>
    </div>
  );
}
