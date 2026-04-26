## 👋 About This Project

Hi, I'm Andrea!

I'm a software engineer from Italy, with a background in **Web Information and Data Engineering**. I’ve always been passionate about data, the web, and building small projects that turn curiosity into something tangible.

Every Monday, I enjoy watching **HumanSafari** and his adventures around the world. If you’ve seen his videos, you know he has a thing for exploring local supermarkets—and at some point, he started casually mentioning Nutella prices in different countries.

After a while, a thought popped into my head:

> _“Why don’t I build a simple data pipeline to analyze all his videos and extract every Nutella price he’s ever mentioned?”_

And that’s how this project was born.

---

## 🛠️ For the curious (and the geeks)

Here’s a more technical breakdown of how this dataset came to life:

- It all started with **scraping transcripts** from Nicolò’s videos.
- I used a simple **regex search for “Nutella”** to identify relevant mentions.
- For each match, I extracted a **context window** around it and checked for nearby references to:
  - prices
  - weights
- This allowed me to perform a **first automated filtering** of potentially useful entries.

From there:

- I **normalized the data** using regex patterns to extract:
  - weight (g)
  - local price
  - currency
- When possible, I inferred the **country from the video title**.

Then came the messy part:

- I used AI to label each entry into categories:
  - ✅ ready
  - ⚠️ data missing
  - ❓ ambiguous
  - ❌ false positive
- After that, I **manually reviewed everything**, often going back to the exact moment in the video referenced by the transcript.

---

## 🎯 The result

I might have missed a few entries here and there—but I managed to build a **clean and usable dataset** without watching thousands of hours of footage.

And more importantly, I turned a fun idea into something you can explore, compare, and maybe even contribute to.

---

If you enjoy this project as much as I enjoyed building it, that’s already a win 🙂
