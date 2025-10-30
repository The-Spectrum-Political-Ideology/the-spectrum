// views/HowItWorksPage.js

export function HowItWorksPage() {
    return `
        <div class="animate-fade-in-up max-w-2xl mx-auto prose dark:prose-invert lg:prose-lg">
            <h1>How It Works</h1>
            <p>
                "The Spectrum" is designed to be a comprehensive tool for political self-discovery.
                Our core quiz is based on the 8values model, which measures your views across four distinct axes.
            </p>
            
            <h2>The Four Axes</h2>
            <h3>Economic Axis (Equality vs. Markets)</h3>
            <p>
                This axis measures your opinion on economic policy.
                A high "Equality" score (closer to 0%) indicates a desire for a state-controlled or collectivized economy.
                A high "Markets" score (closer to 100%) indicates a belief in free-market capitalism and minimal government intervention.
            </p>
            
            <h3>Diplomatic Axis (World vs. Nation)</h3>
            <p>
                This axis measures your approach to foreign policy.
                A high "World" score (closer to 0%) indicates a cosmopolitan, internationalist, and cooperative worldview.
                A high "Nation" score (closer to 100%) indicates a nationalist, protectionist, and more isolationist worldview.
            </p>

            <h3>Civil Axis (Liberty vs. Authority)</h3>
            <p>
                This axis measures your view on the role of the state in personal lives.
                A high "Liberty" score (closer to 0%) favors individual freedoms, privacy, and skepticism of state power.
                A high "Authority" score (closer to 100%) believes a strong state is necessary to ensure order, security, and stability, even at the cost of some freedoms.
            </p>
            
            <h3>Societal Axis (Progress vs. Tradition)</h3>
            <p>
                This axis measures your stance on social and cultural issues.
                A high "Progress" score (closer to 0%) supports social change, scientific advancement, and new ideas.
                A high "Tradition" score (closer to 100%) emphasizes the importance of traditional values, customs, and religious beliefs.
            </p>
            
            <h2>Scoring & Matching</h2>
            <p>
                Each answer you give adds or subtracts points from one or more axes. Your final position on each axis is
                calculated as a percentage. We then compare your 4-dimensional score against a database of predefined
                ideologies, using a simple Euclidean distance formula to find the one you are "closest" to.
            </p>
            
            <h2>"Formulate Your Words" (Coming Soon)</h2>
            <p>
                This feature (coming in Milestone 2) will use a client-side, keyword-based sentiment analysis model. It will
                not be true AI, but a clever parser that looks for positive ("I strongly support," "absolutely") and
                negative ("I oppose," "never") keywords to assign a score, giving you another way to express your views.
            </p>
        </div>
    `;
}