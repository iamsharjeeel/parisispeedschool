'use client';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main" className="not-found">
      <div className="container">
        <p className="eyebrow">PARISI HORSHAM</p>
        <h1>
          LET’S TRY
          <br />
          THAT AGAIN.
        </h1>
        <p>
          We couldn’t load this page. You can try again or call 215-706-8260.
        </p>
        <button className="button" onClick={reset}>
          Try again →
        </button>
      </div>
    </main>
  );
}
