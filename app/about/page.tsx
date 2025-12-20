import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-muted">
        <div className="container mx-auto px-6 lg:px-16 text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl lg:text-7xl tracking-[0.3em] font-light mb-8">
            A B O U T
            <br />
            U S
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            A different kind of travel company, built on honesty and human connection.
          </p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-6 lg:px-16 max-w-3xl">
          <p className="text-muted-foreground leading-relaxed mb-6">
            Slow Morocco grew from a quiet understanding that emerged after more than a decade of guiding travelers through Morocco's deserts, mountains, and the interior landscapes most never see.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Since 2013, we've walked the classic routes and the roads between them, watching how people truly move through this country. Many come seeking depth, not content to post.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-6">
            What we learned was simple: the most profound journeys happen not when you see more, but when you see clearly. When you stop performing and start noticing. When you remove the rush and discover what remains.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Slow Morocco exists for travelers who recognize that depth requires time, and clarity requires space.
          </p>
        </div>
      </section>

      {/* How We Work */}
      <section className="py-20 md:py-28 bg-sand">
        <div className="container mx-auto px-6 lg:px-16 max-w-3xl">
          <h2 className="text-2xl md:text-3xl tracking-[0.3em] font-light text-center mb-16">
            H O W &nbsp; W E &nbsp; W O R K
          </h2>

          <p className="text-muted-foreground leading-relaxed mb-8">
            We don't design trips to look impressive on paper. We design them to feel good while you're living them.
          </p>

          <p className="text-muted-foreground leading-relaxed mb-8">
            We start with time, not a checklist. Most tours squeeze places into days. We do the opposite: shape routes around realistic distances, fewer hotel changes, and days that leave room to breathe.
          </p>

          <p className="text-muted-foreground leading-relaxed mb-8">
            Before you commit, you see exactly what each day involves—drive times, where it's heavy and where it's light, what's included and what's not. If something feels too dense, we adjust. You book when the trip makes sense in your body, not when we've worn you down with sales talk.
          </p>
        </div>
      </section>

      {/* Our Philosophy */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-6 lg:px-16 max-w-3xl">
          <h2 className="text-2xl md:text-3xl tracking-[0.3em] font-light text-center mb-16">
            O U R &nbsp; P H I L O S O P H Y
          </h2>

          <p className="text-muted-foreground leading-relaxed mb-8">
            We don't believe in selling dreams. We believe in creating conditions for discovery. Morocco has its own wisdom, its own pace, its own way of revealing itself. Our job is to get out of the way while making sure you're comfortable, safe, and free to wander.
          </p>

          <p className="text-muted-foreground leading-relaxed">
            Every guide we work with, every riad we recommend, every road we suggest—it's all been walked by us first. We don't recommend what we haven't experienced. We don't promise what we can't deliver.
          </p>
        </div>
      </section>

      {/* Quote */}
      <section className="py-16 md:py-24 bg-sand">
        <div className="container mx-auto px-6 lg:px-16 max-w-4xl text-center">
          <p className="font-serif text-2xl md:text-4xl italic text-foreground leading-relaxed">
            "We'd rather lose a booking than promise something we can't deliver."
          </p>
        </div>
      </section>

      {/* Our Standards */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-6 lg:px-16">
          <h2 className="text-2xl md:text-3xl tracking-[0.3em] font-light text-center mb-16">
            O U R &nbsp; S T A N D A R D S
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {/* Straight Talk */}
            <div className="border-l border-border pl-6">
              <h3 className="text-sm tracking-[0.2em] uppercase mb-4">
                S T R A I G H T<br />T A L K
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We tell you what a journey actually involves: long drives, dusty towns, simple camps. If something is likely to bother you, you hear about it before you pay, not after you arrive.
              </p>
            </div>

            {/* Respect for Everyone */}
            <div className="border-l border-border pl-6">
              <h3 className="text-sm tracking-[0.2em] uppercase mb-4">
                R E S P E C T<br />F O R<br />E V E R Y O N E
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The people driving, hosting, and guiding you work realistic days. No pressure to upsell. When people around you are treated fairly, your journey feels calmer and more human.
              </p>
            </div>

            {/* Money with No Games */}
            <div className="border-l border-border pl-6">
              <h3 className="text-sm tracking-[0.2em] uppercase mb-4">
                M O N E Y<br />W I T H<br />N O &nbsp; G A M E S
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Clear prices. Written inclusions. No hidden 'local payments' or surprise shopping stops.
              </p>
            </div>

            {/* Who We Work With */}
            <div className="border-l border-border pl-6">
              <h3 className="text-sm tracking-[0.2em] uppercase mb-4">
                W H O<br />W E<br />W O R K &nbsp; W I T H
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We work with a curated network of Moroccan drivers, guides, and hosts we know personally. If someone doesn't match our standards, we don't keep them in the circle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-20 md:py-28 bg-sand">
        <div className="container mx-auto px-6 lg:px-16 max-w-3xl">
          <h2 className="text-2xl md:text-3xl tracking-[0.3em] font-light text-center mb-16">
            W H A T &nbsp; W E &nbsp; O F F E R
          </h2>

          <p className="text-muted-foreground leading-relaxed mb-8">
            We design private journeys shaped by realistic distances and fewer hotel changes. Days structured around witnessing rather than conquering. The morning call to prayer. The way afternoon sun transforms desert stone from amber to rose. The silence between conversations.
          </p>

          <p className="text-muted-foreground leading-relaxed">
            The people who work with us—drivers who understand when silence matters, hosts who welcome with quiet warmth, guides who carry tradition as lived knowledge—are chosen for steadiness, sincerity, and care. This knowledge, accumulated slowly and tested daily, has taken a shape. That shape is Slow Morocco.
          </p>
        </div>
      </section>

      {/* Our Promise */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-6 lg:px-16 max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl tracking-[0.3em] font-light mb-12">
            O U R &nbsp; P R O M I S E
          </h2>

          <p className="text-muted-foreground leading-relaxed mb-6 italic font-display text-lg">
            You arrive. We remove the noise. The rest is simply being here.
          </p>

          <p className="text-muted-foreground leading-relaxed mb-12">
            If you travel with us, this is what we offer: not perfection, but honesty. Not transformation, but space where it becomes possible. Not guidance, but the removal of what prevents clear seeing.
          </p>

          <Link
            href="/plan-your-trip"
            className="inline-block bg-foreground text-background px-10 py-4 text-xs tracking-[0.2em] uppercase hover:bg-foreground/90 transition-colors"
          >
            Start A Conversation
          </Link>
        </div>
      </section>
    </div>
  );
}
