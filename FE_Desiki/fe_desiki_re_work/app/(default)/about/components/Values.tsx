import React from "react";
const Values = () => {
  const values = [
    {
      title: "Quality",
      description:
        "We never compromise on ingredients or formulations. Each product is developed with meticulous attention to detail.",
    },
    {
      title: "Sustainability",
      description:
        "From recyclable packaging to ethical sourcing, we're committed to minimizing our environmental footprint.",
    },
    {
      title: "Transparency",
      description:
        "We believe in being honest about what goes into our products and how they're made. No secrets, just skincare.",
    },
    {
      title: "Inclusivity",
      description:
        "Our products are formulated for all skin types and tones. We celebrate diversity in beauty and skincare needs.",
    },
  ];
  return (
    <section className="py-24 px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-light mb-6 tracking-tight">
            Our Values
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            These core principles guide everything we do, from product
            development to customer service.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div key={index} className="bg-white p-8 rounded-sm shadow-sm">
              <h3 className="text-xl font-medium mb-4">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-20 bg-white p-10 rounded-sm shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-light mb-6 tracking-tight">
                Our Commitment to the Planet
              </h3>
              <p className="text-gray-600 mb-6">
                We believe that beauty shouldn't come at the expense of our
                environment. That's why we've implemented sustainable practices
                throughout our supply chain.
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-black font-medium mr-2">•</span>
                  <span>Recyclable and biodegradable packaging</span>
                </li>
                <li className="flex items-start">
                  <span className="text-black font-medium mr-2">•</span>
                  <span>Cruelty-free and vegan formulations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-black font-medium mr-2">•</span>
                  <span>Ethically sourced ingredients</span>
                </li>
                <li className="flex items-start">
                  <span className="text-black font-medium mr-2">•</span>
                  <span>Carbon-neutral shipping options</span>
                </li>
              </ul>
            </div>
            <div className="h-[300px] rounded-sm overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1192&q=80"
                alt="Sustainable skincare packaging and natural ingredients"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Values;
