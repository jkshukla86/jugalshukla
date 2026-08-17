UPDATE public.pages
SET blocks = jsonb_set(
  blocks,
  '{7,data,items}',
  '[
    {"name": "Kunal Mehta", "role": "Data and AI Platform Head", "quote": "I worked with Jugal while working on an SEO project. He has immense knowledge, extremely good understanding of the space, plus intuition of how industry is changing with Gen AI integration across all Search Engines. He is absolutely phenomenal to work with, meets deadlines, is extremely comprehensive, and puts in a lot of hard work for client success. Wish him all the best and hope to work with him again in the future.", "company": ""},
    {"name": "Ajay Raj Negi", "role": "MD", "quote": "Working with Jugal entirely changed the way we approached digital marketing. He helped us identify the right audience, improve our campaigns, and build a much more structured lead generation process. His ability to combine SEO, paid advertising, social media, and automation into one growth strategy is impressive. He is highly knowledgeable, responsive, and focused on measurable results.", "company": "IHMS Kotdwar"},
    {"name": "Vikas Gupta", "role": "Business Owner", "quote": "Jugal brings both strategic thinking and hands-on execution to digital marketing. From SEO and content strategy to PPC campaigns and lead generation, he understands how different channels work together to drive growth. His data-driven approach helped us make better marketing decisions and improve the quality of our leads. I would definitely recommend him to businesses looking to build a stronger digital presence and generate consistent growth.", "company": "BGSG Solution Pvt. Ltd."}
  ]'::jsonb
)
WHERE path = '/';
