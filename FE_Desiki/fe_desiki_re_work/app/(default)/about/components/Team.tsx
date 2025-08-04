import React from "react";
const Team = () => {
  const team = [
    {
      name: "Emma Chen",
      role: "Founder & CEO",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80",
      bio: "With a background in biochemistry and a passion for natural skincare, Emma founded Desiki to bridge the gap between science and nature.",
    },
    {
      name: "David Park",
      role: "Head of Product Development",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      bio: "David brings 15 years of experience in cosmetic chemistry, ensuring our formulations are both effective and gentle.",
    },
    {
      name: "Sophia Rodriguez",
      role: "Creative Director",
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=761&q=80",
      bio: "Sophia oversees our brand identity, ensuring every aspect of Desiki communicates our commitment to elegant simplicity.",
    },
    {
      name: "Michael Kim",
      role: "Sustainability Officer",
      image:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
      bio: "Michael leads our environmental initiatives, constantly finding new ways to reduce our ecological footprint.",
    },
  ];
  return (
    <section className="py-24 px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-light mb-6 tracking-tight">
            Meet Our Team
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The passionate individuals behind Desiki who work tirelessly to
            bring you exceptional skincare.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <div key={index} className="group">
              <div className="mb-6 overflow-hidden rounded-sm">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-[350px] object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="text-xl font-medium">{member.name}</h3>
              <p className="text-gray-500 mb-4">{member.role}</p>
              <p className="text-gray-600">{member.bio}</p>
            </div>
          ))}
        </div>
        <div className="mt-24 text-center">
          <h3 className="text-2xl font-light mb-8 tracking-tight">
            Join Our Team
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto mb-10">
            We're always looking for talented individuals who share our passion
            for skincare and sustainability. Check out our current openings or
            send us your resume.
          </p>
          <a
            href="#"
            className="inline-block bg-black text-white px-8 py-3 rounded-sm hover:bg-gray-800 transition-colors"
          >
            View Careers
          </a>
        </div>
      </div>
    </section>
  );
};
export default Team;
