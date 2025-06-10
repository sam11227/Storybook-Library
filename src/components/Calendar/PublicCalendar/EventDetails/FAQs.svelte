<script>
  export let faqs = [
    {
      question: "What are the show’s COVID protocols?",
      answer:
        "Proof of vaccination is required upon entry. The name on your vaccination card must match the one on your ID.",
    },
    {
      question: "Is there an age requirement?",
      answer:
        "Yes, the venue serves alcohol, so there is a strict 21+ age requirement unless otherwise specified.",
    },
    {
      question: "Is there a food/drink minimum?",
      answer:
        "No, there is not a drink minimum but it would be great for you to get a drink to support Bar Lubitsch - we love them for letting us put this show on!",
    },
    {
      question: "What’s up with parking?",
      answer:
        "There's plenty of street parking around Bar Lubitsch, and a paid lot just a few doors down.",
    },
    {
      question: "Can I talk during the show?",
      answer:
        "Talking and heckling while the comedians are on stage is strictly discouraged. Please don't ruin the show for everyone else.",
    },
    {
      question:
        "If the show is sold out, will there be tickets available at the door?",
      answer:
        "Nope! We sell out often so we recommend getting tickets online in advance. If the show is listed as Sold Out on the web, then we will not have extra tickets sold at the door.",
    },
  ];

  let characterLimit = 500;
  let showFullContent = false;
  let visibleFaqs = [];

  // Recalculate visible FAQs when `showFullContent` changes
  $: if (showFullContent) {
    visibleFaqs = faqs;
  } else {
    visibleFaqs = [];
    let charCount = 0;

    for (const faq of faqs) {
      const faqLength = faq.question.length + faq.answer.length;
      if (charCount + faqLength <= characterLimit) {
        visibleFaqs.push(faq);
        charCount += faqLength;
      } else {
        break;
      }
    }
  }

  function toggleContent() {
    showFullContent = !showFullContent;
  }
</script>

<div class="flex flex-col gap-3">
  <h2 class="font-medium text-2xl text-gray-900">FAQs</h2>
  {#if faqs.length > 0}
    <ul class="font-normal text-[16px] leading-6">
      {#each visibleFaqs as faq}
        <li class="text-Text-Secondary">{faq.question}</li>
        <li class="text-Text-Tartiary mb-3">{faq.answer}</li>
      {/each}
    </ul>

    {#if !showFullContent && visibleFaqs.length < faqs.length}
      <button
        on:click={toggleContent}
        class="text-brand-Primary text-[16px] font-semibold mt-2 text-left"
        >Read more</button
      >
    {:else if showFullContent}
      <button
        on:click={toggleContent}
        class="text-brand-Primary text-[16px] font-semibold mt-2 text-left"
        >Read less</button
      >
    {/if}
  {:else}
    <p>No FAQs available at the moment.</p>
  {/if}
</div>
