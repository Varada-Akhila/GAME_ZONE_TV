import React, { useState, useEffect } from "react";
// import ScientistsVideo from "../assets/scientists-video.mp4";
// import page1 from "../assets/scientists/page1.png";
// import page2 from "../assets/scientists/page2.png";
// import page3 from "../assets/scientists/page3.png";
// import page4 from "../assets/scientists/page4.png";
// import page5 from "../assets/scientists/page5.png";
// import page6 from "../assets/scientists/page6.png";

const ScientistsVideo="https://games.vrplay.in/videos/Architects.mp4";
const page1="https://games.vrplay.in/images/page1.png";
const page2="https://games.vrplay.in/images/page2.png";
const page3="https://games.vrplay.in/images/page3.png";
const page4="https://games.vrplay.in/images/page4.png";
const page5="https://games.vrplay.in/images/page5.png";
const page6="https://games.vrplay.in/images/page6.png";

const ALL_QUESTIONS = [

/* =========================
   ISAAC NEWTON
========================= */

{
  question: "Who discovered gravity?",
  answer: "Isaac Newton",
  options: ["Isaac Newton","Albert Einstein","Galileo Galilei","Nikola Tesla"]
},

{
  question: "Which scientist developed the laws of motion?",
  answer: "Isaac Newton",
  options: ["Isaac Newton","Charles Darwin","Michael Faraday","James Watt"]
},

{
  question: "Gravity is most closely associated with which scientist?",
  answer: "Isaac Newton",
  options: ["Isaac Newton","Marie Curie","Niels Bohr","Gregor Mendel"]
},

{
  question: "Who explained how objects move using the laws of motion?",
  answer: "Isaac Newton",
  options: ["Isaac Newton","Alexander Fleming","Karl Benz","Samuel Morse"]
},

/* =========================
   ALBERT EINSTEIN
========================= */

{
  question: "Who developed the Theory of Relativity?",
  answer: "Albert Einstein",
  options: ["Albert Einstein","Isaac Newton","Nikola Tesla","James Chadwick"]
},

{
  question: "Which scientist changed our understanding of space and time?",
  answer: "Albert Einstein",
  options: ["Albert Einstein","Dmitri Mendeleev","John Logie Baird","Karl Benz"]
},

{
  question: "E = mc² is associated with which scientist?",
  answer: "Albert Einstein",
  options: ["Albert Einstein","Louis Pasteur","Gregor Mendel","Rudolf Diesel"]
},

{
  question: "Who is famous for the Theory of Relativity?",
  answer: "Albert Einstein",
  options: ["Albert Einstein","Tim Berners-Lee","Blaise Pascal","Robert Hooke"]
},

/* =========================
   THOMAS EDISON
========================= */

{
  question: "Who invented the practical electric light bulb?",
  answer: "Thomas Edison",
  options: ["Thomas Edison","Nikola Tesla","Alexander Graham Bell","Karl Benz"]
},

{
  question: "Which inventor brought electric lighting to millions of homes?",
  answer: "Thomas Edison",
  options: ["Thomas Edison","James Watt","Michael Faraday","Marconi"]
},

{
  question: "Who is famous for improving the light bulb?",
  answer: "Thomas Edison",
  options: ["Thomas Edison","Einstein","Newton","Curie"]
},

{
  question: "Which inventor held many patents and improved electric devices?",
  answer: "Thomas Edison",
  options: ["Thomas Edison","Fleming","Mendel","Bohr"]
},

/* =========================
   ALEXANDER GRAHAM BELL
========================= */

{
  question: "Who invented the telephone?",
  answer: "Alexander Graham Bell",
  options: ["Alexander Graham Bell","Samuel Morse","Marconi","Tesla"]
},

{
  question: "Long-distance voice communication became possible because of whom?",
  answer: "Alexander Graham Bell",
  options: ["Alexander Graham Bell","Thomas Edison","Karl Benz","Pascal"]
},

{
  question: "Which inventor is linked to the telephone?",
  answer: "Alexander Graham Bell",
  options: ["Alexander Graham Bell","Newton","Curie","Ramanujan"]
},

{
  question: "Who made telephone communication possible?",
  answer: "Alexander Graham Bell",
  options: ["Alexander Graham Bell","Rutherford","Bohr","Volta"]
},

/* =========================
   NIKOLA TESLA
========================= */

{
  question: "Who developed the AC power system?",
  answer: "Nikola Tesla",
  options: ["Nikola Tesla","Thomas Edison","James Watt","Faraday"]
},

{
  question: "Electricity in homes is largely supplied through which system developed by Tesla?",
  answer: "AC Power",
  options: ["AC Power","DC Battery","Steam Power","Solar Cell"]
},

{
  question: "Which inventor is famous for alternating current electricity?",
  answer: "Nikola Tesla",
  options: ["Nikola Tesla","Bell","Marconi","Pasteur"]
},

{
  question: "Who made major contributions to modern electrical systems?",
  answer: "Nikola Tesla",
  options: ["Nikola Tesla","Darwin","Mendel","Hooke"]
},

/* =========================
   MARIE CURIE
========================= */

{
  question: "Who discovered radioactivity?",
  answer: "Marie Curie",
  options: ["Marie Curie","Einstein","Newton","Faraday"]
},

{
  question: "Which scientist became famous for radioactivity research?",
  answer: "Marie Curie",
  options: ["Marie Curie","Tesla","Bell","Baird"]
},

{
  question: "Who won Nobel Prizes in two scientific fields?",
  answer: "Marie Curie",
  options: ["Marie Curie","Darwin","Morse","Volta"]
},

{
  question: "Radioactivity is most closely associated with whom?",
  answer: "Marie Curie",
  options: ["Marie Curie","Raman","Bose","Bhabha"]
},

/* =========================
   GALILEO GALILEI
========================= */

{
  question: "Who improved the telescope?",
  answer: "Galileo Galilei",
  options: ["Galileo Galilei","Newton","Einstein","Tesla"]
},

{
  question: "Which scientist made discoveries about planets and stars?",
  answer: "Galileo Galilei",
  options: ["Galileo Galilei","Pasteur","Fleming","Mendel"]
},

{
  question: "Who is often called the father of observational astronomy?",
  answer: "Galileo Galilei",
  options: ["Galileo Galilei","Bohr","Rutherford","Chadwick"]
},

{
  question: "Which scientist studied the heavens using a telescope?",
  answer: "Galileo Galilei",
  options: ["Galileo Galilei","Pascal","Volta","Torricelli"]
},

/* =========================
   CHARLES DARWIN
========================= */

{
  question: "Who developed the Theory of Evolution?",
  answer: "Charles Darwin",
  options: ["Charles Darwin","Newton","Einstein","Bell"]
},

{
  question: "Which scientist explained how living things change over time?",
  answer: "Charles Darwin",
  options: ["Charles Darwin","Tesla","Curie","Faraday"]
},

{
  question: "Evolution is associated with which scientist?",
  answer: "Charles Darwin",
  options: ["Charles Darwin","Mendel","Fleming","Baird"]
},

{
  question: "Who wrote ideas about natural selection?",
  answer: "Charles Darwin",
  options: ["Charles Darwin","Marconi","Volta","Hooke"]
},

/* =========================
   LOUIS PASTEUR
========================= */

{
  question: "Who developed pasteurization?",
  answer: "Louis Pasteur",
  options: ["Louis Pasteur","Darwin","Newton","Tesla"]
},

{
  question: "Which scientist helped explain how germs spread diseases?",
  answer: "Louis Pasteur",
  options: ["Louis Pasteur","Bell","Curie","Faraday"]
},

{
  question: "Pasteurization is named after whom?",
  answer: "Louis Pasteur",
  options: ["Louis Pasteur","Einstein","Bohr","Raman"]
},

{
  question: "Who made major contributions to germ theory?",
  answer: "Louis Pasteur",
  options: ["Louis Pasteur","Ramanujan","Aryabhata","Kalam"]
},

/* =========================
   GREGOR MENDEL
========================= */

{
  question: "Who discovered the basic principles of genetics?",
  answer: "Gregor Mendel",
  options: ["Gregor Mendel","Darwin","Newton","Tesla"]
},

{
  question: "Who is known as the Father of Genetics?",
  answer: "Gregor Mendel",
  options: ["Gregor Mendel","Einstein","Curie","Faraday"]
},

{
  question: "Heredity was studied by which scientist?",
  answer: "Gregor Mendel",
  options: ["Gregor Mendel","Pasteur","Bell","Benz"]
},

{
  question: "Which scientist studied inherited traits in plants?",
  answer: "Gregor Mendel",
  options: ["Gregor Mendel","Bohr","Hooke","Morse"]
},

/* =========================
   MICHAEL FARADAY
========================= */

{
  question: "Who discovered electromagnetic induction?",
  answer: "Michael Faraday",
  options: ["Michael Faraday","Newton","Einstein","Darwin"]
},

{
  question: "Electric generators became possible because of whose work?",
  answer: "Michael Faraday",
  options: ["Michael Faraday","Bell","Curie","Fleming"]
},

{
  question: "Which scientist made major contributions to electromagnetism?",
  answer: "Michael Faraday",
  options: ["Michael Faraday","Tesla","Pascal","Morse"]
},

{
  question: "Electromagnetic induction is associated with whom?",
  answer: "Michael Faraday",
  options: ["Michael Faraday","Rutherford","Bohr","Chadwick"]
},

/* =========================
   JAMES WATT
========================= */

{
  question: "Who improved the steam engine?",
  answer: "James Watt",
  options: ["James Watt","Tesla","Bell","Darwin"]
},

{
  question: "Factories and trains benefited from improvements made by whom?",
  answer: "James Watt",
  options: ["James Watt","Newton","Einstein","Curie"]
},

{
  question: "Which inventor helped power the Industrial Revolution?",
  answer: "James Watt",
  options: ["James Watt","Mendel","Pasteur","Hooke"]
},

{
  question: "The improved steam engine is associated with which inventor?",
  answer: "James Watt",
  options: ["James Watt","Volta","Benz","Diesel"]
},

/* =========================
   WRIGHT BROTHERS
========================= */

{
  question: "Who built the first successful powered airplane?",
  answer: "Wright Brothers",
  options: ["Wright Brothers","Bell","Tesla","Marconi"]
},

{
  question: "Modern aviation began with whose achievement?",
  answer: "Wright Brothers",
  options: ["Wright Brothers","Newton","Einstein","Faraday"]
},
/* =========================
   WRIGHT BROTHERS
========================= */

{
  question: "Who changed transportation forever with the first powered flight?",
  answer: "Wright Brothers",
  options: ["Wright Brothers","Karl Benz","Thomas Edison","Nikola Tesla"]
},

{
  question: "The first successful airplane was built by whom?",
  answer: "Wright Brothers",
  options: ["Wright Brothers","Samuel Morse","James Watt","Albert Einstein"]
},

/* =========================
   GUGLIELMO MARCONI
========================= */

{
  question: "Who developed radio communication?",
  answer: "Guglielmo Marconi",
  options: ["Guglielmo Marconi","Alexander Graham Bell","Nikola Tesla","John Logie Baird"]
},

{
  question: "Wireless messaging became possible because of whom?",
  answer: "Guglielmo Marconi",
  options: ["Guglielmo Marconi","Thomas Edison","Karl Benz","Louis Pasteur"]
},

{
  question: "Which inventor is known as a pioneer of radio technology?",
  answer: "Guglielmo Marconi",
  options: ["Guglielmo Marconi","Gregor Mendel","James Chadwick","Niels Bohr"]
},

{
  question: "Radio communication is associated with which inventor?",
  answer: "Guglielmo Marconi",
  options: ["Guglielmo Marconi","Robert Hooke","Alexander Fleming","C. V. Raman"]
},

/* =========================
   JOHANNES GUTENBERG
========================= */

{
  question: "Who invented the printing press?",
  answer: "Johannes Gutenberg",
  options: ["Johannes Gutenberg","Samuel Morse","Tim Berners-Lee","Karl Benz"]
},

{
  question: "Which invention helped spread knowledge around the world?",
  answer: "Printing Press",
  options: ["Printing Press","Telephone","Battery","Television"]
},

{
  question: "Who revolutionized book printing?",
  answer: "Johannes Gutenberg",
  options: ["Johannes Gutenberg","Newton","Einstein","Darwin"]
},

{
  question: "The printing press was invented by whom?",
  answer: "Johannes Gutenberg",
  options: ["Johannes Gutenberg","Tesla","Bell","Pasteur"]
},

/* =========================
   BENJAMIN FRANKLIN
========================= */

{
  question: "Who conducted famous experiments with electricity using a kite?",
  answer: "Benjamin Franklin",
  options: ["Benjamin Franklin","Faraday","Tesla","Volta"]
},

{
  question: "Which scientist improved understanding of electricity?",
  answer: "Benjamin Franklin",
  options: ["Benjamin Franklin","Darwin","Mendel","Hooke"]
},

{
  question: "The kite experiment is associated with whom?",
  answer: "Benjamin Franklin",
  options: ["Benjamin Franklin","Curie","Bhabha","Kalam"]
},

{
  question: "Who helped advance the study of electricity in early science?",
  answer: "Benjamin Franklin",
  options: ["Benjamin Franklin","Bohr","Rutherford","Chadwick"]
},

/* =========================
   WILHELM RONTGEN
========================= */

{
  question: "Who discovered X-rays?",
  answer: "Wilhelm Röntgen",
  options: ["Wilhelm Röntgen","Alexander Fleming","Louis Pasteur","Marie Curie"]
},

{
  question: "Doctors can see inside the body because of whose discovery?",
  answer: "Wilhelm Röntgen",
  options: ["Wilhelm Röntgen","Newton","Tesla","Bell"]
},

{
  question: "Which scientist discovered X-rays in 1895?",
  answer: "Wilhelm Röntgen",
  options: ["Wilhelm Röntgen","Einstein","Faraday","Morse"]
},

{
  question: "Medical imaging benefited greatly from whose discovery?",
  answer: "Wilhelm Röntgen",
  options: ["Wilhelm Röntgen","Pascal","Volta","Diesel"]
},

/* =========================
   ALEXANDER FLEMING
========================= */

{
  question: "Who discovered penicillin?",
  answer: "Alexander Fleming",
  options: ["Alexander Fleming","Louis Pasteur","Gregor Mendel","Charles Darwin"]
},

{
  question: "The first widely used antibiotic was discovered by whom?",
  answer: "Alexander Fleming",
  options: ["Alexander Fleming","Albert Einstein","Nikola Tesla","James Watt"]
},

{
  question: "Penicillin is associated with which scientist?",
  answer: "Alexander Fleming",
  options: ["Alexander Fleming","Bell","Marconi","Benz"]
},

{
  question: "Which discovery helped save millions of lives from infections?",
  answer: "Penicillin",
  options: ["Penicillin","Telephone","Battery","Barometer"]
},

/* =========================
   TIM BERNERS-LEE
========================= */

{
  question: "Who invented the World Wide Web?",
  answer: "Tim Berners-Lee",
  options: ["Tim Berners-Lee","Bill Gates","Thomas Edison","Nikola Tesla"]
},

{
  question: "Which inventor transformed information sharing through the web?",
  answer: "Tim Berners-Lee",
  options: ["Tim Berners-Lee","Newton","Darwin","Curie"]
},

{
  question: "WWW stands for what?",
  answer: "World Wide Web",
  options: ["World Wide Web","World Web Window","Wide World Wire","Web World Wide"]
},

{
  question: "The World Wide Web was invented by whom?",
  answer: "Tim Berners-Lee",
  options: ["Tim Berners-Lee","Pascal","Morse","Baird"]
},

/* =========================
   BLAISE PASCAL
========================= */

{
  question: "Who invented an early mechanical calculator?",
  answer: "Blaise Pascal",
  options: ["Blaise Pascal","Newton","Einstein","Bell"]
},

{
  question: "Which mathematician created an early calculating machine?",
  answer: "Blaise Pascal",
  options: ["Blaise Pascal","Ramanujan","Aryabhata","Mendel"]
},

{
  question: "The Pascaline calculator was invented by whom?",
  answer: "Blaise Pascal",
  options: ["Blaise Pascal","Volta","Diesel","Benz"]
},

{
  question: "Who contributed to mathematics and mechanical calculation?",
  answer: "Blaise Pascal",
  options: ["Blaise Pascal","Curie","Faraday","Fleming"]
},

/* =========================
   SAMUEL MORSE
========================= */

{
  question: "Who developed the telegraph?",
  answer: "Samuel Morse",
  options: ["Samuel Morse","Alexander Graham Bell","Marconi","Tesla"]
},

{
  question: "Who created Morse Code?",
  answer: "Samuel Morse",
  options: ["Samuel Morse","Newton","Einstein","Darwin"]
},

{
  question: "Which inventor made communication faster using coded signals?",
  answer: "Samuel Morse",
  options: ["Samuel Morse","Pasteur","Mendel","Hooke"]
},

{
  question: "Morse Code was developed by whom?",
  answer: "Samuel Morse",
  options: ["Samuel Morse","Benz","Volta","Bohr"]
},

/* =========================
   JOHN LOGIE BAIRD
========================= */

{
  question: "Who developed one of the first working television systems?",
  answer: "John Logie Baird",
  options: ["John Logie Baird","Marconi","Bell","Tesla"]
},

{
  question: "Which inventor is known as a television pioneer?",
  answer: "John Logie Baird",
  options: ["John Logie Baird","Newton","Curie","Faraday"]
},

{
  question: "Early television technology is associated with whom?",
  answer: "John Logie Baird",
  options: ["John Logie Baird","Darwin","Pasteur","Mendel"]
},

{
  question: "Who helped make television possible?",
  answer: "John Logie Baird",
  options: ["John Logie Baird","Pascal","Volta","Rutherford"]
},

/* =========================
   KARL BENZ
========================= */

{
  question: "Who built the first practical automobile?",
  answer: "Karl Benz",
  options: ["Karl Benz","Rudolf Diesel","James Watt","Thomas Edison"]
},

{
  question: "The modern car industry began with whose invention?",
  answer: "Karl Benz",
  options: ["Karl Benz","Newton","Einstein","Bell"]
},

{
  question: "Which inventor is linked to the first practical car?",
  answer: "Karl Benz",
  options: ["Karl Benz","Marconi","Fleming","Baird"]
},

{
  question: "Automobile pioneer Karl Benz came from which field?",
  answer: "Transportation",
  options: ["Transportation","Medicine","Astronomy","Genetics"]
},

/* =========================
   RUDOLF DIESEL
========================= */

{
  question: "Who invented the diesel engine?",
  answer: "Rudolf Diesel",
  options: ["Rudolf Diesel","Karl Benz","James Watt","Nikola Tesla"]
},

{
  question: "Many trucks and machines use an engine invented by whom?",
  answer: "Rudolf Diesel",
  options: ["Rudolf Diesel","Newton","Curie","Darwin"]
},

{
  question: "The diesel engine was invented by whom?",
  answer: "Rudolf Diesel",
  options: ["Rudolf Diesel","Karl Benz","Thomas Edison","James Watt"]
},

{
  question: "Which inventor gave his name to the diesel engine?",
  answer: "Rudolf Diesel",
  options: ["Rudolf Diesel","Nikola Tesla","Samuel Morse","Marconi"]
},

/* =========================
   ALESSANDRO VOLTA
========================= */

{
  question: "Who invented the first electric battery?",
  answer: "Alessandro Volta",
  options: ["Alessandro Volta","Michael Faraday","Nikola Tesla","Thomas Edison"]
},

{
  question: "The volt unit is named after which scientist?",
  answer: "Alessandro Volta",
  options: ["Alessandro Volta","Newton","Einstein","Curie"]
},

{
  question: "Which inventor provided a new source of electrical energy through batteries?",
  answer: "Alessandro Volta",
  options: ["Alessandro Volta","Bell","Pasteur","Darwin"]
},

/* =========================
   EVANGELISTA TORRICELLI
========================= */

{
  question: "Who invented the barometer?",
  answer: "Evangelista Torricelli",
  options: ["Evangelista Torricelli","Galileo Galilei","Newton","Einstein"]
},

{
  question: "Which instrument measures air pressure?",
  answer: "Barometer",
  options: ["Barometer","Thermometer","Microscope","Telescope"]
},

{
  question: "Air pressure measurement became possible because of whom?",
  answer: "Evangelista Torricelli",
  options: ["Evangelista Torricelli","Faraday","Tesla","Marconi"]
},

/* =========================
   DANIEL GABRIEL FAHRENHEIT
========================= */

{
  question: "Who invented the mercury thermometer?",
  answer: "Daniel Gabriel Fahrenheit",
  options: ["Daniel Gabriel Fahrenheit","Torricelli","Volta","Pascal"]
},

{
  question: "Which temperature scale is named after Fahrenheit?",
  answer: "Fahrenheit Scale",
  options: ["Fahrenheit Scale","Celsius Scale","Kelvin Scale","Rankine Scale"]
},

{
  question: "Who developed the Fahrenheit temperature scale?",
  answer: "Daniel Gabriel Fahrenheit",
  options: ["Daniel Gabriel Fahrenheit","Newton","Curie","Bohr"]
},

/* =========================
   JAMES CHADWICK
========================= */

{
  question: "Who discovered the neutron?",
  answer: "James Chadwick",
  options: ["James Chadwick","J. J. Thomson","Ernest Rutherford","Niels Bohr"]
},

{
  question: "Which scientist discovered an important particle inside the atom called the neutron?",
  answer: "James Chadwick",
  options: ["James Chadwick","Newton","Einstein","Tesla"]
},

{
  question: "The neutron was discovered by whom?",
  answer: "James Chadwick",
  options: ["James Chadwick","Faraday","Bell","Marconi"]
},

/* =========================
   J. J. THOMSON
========================= */

{
  question: "Who discovered the electron?",
  answer: "J. J. Thomson",
  options: ["J. J. Thomson","James Chadwick","Ernest Rutherford","Niels Bohr"]
},

{
  question: "Which scientist helped reveal the structure of atoms by discovering electrons?",
  answer: "J. J. Thomson",
  options: ["J. J. Thomson","Darwin","Pasteur","Mendel"]
},

{
  question: "The electron was discovered by whom?",
  answer: "J. J. Thomson",
  options: ["J. J. Thomson","Volta","Pascal","Morse"]
},

/* =========================
   ERNEST RUTHERFORD
========================= */

{
  question: "Who discovered the atomic nucleus?",
  answer: "Ernest Rutherford",
  options: ["Ernest Rutherford","J. J. Thomson","James Chadwick","Niels Bohr"]
},

{
  question: "Modern atomic theory was advanced by which scientist who discovered the nucleus?",
  answer: "Ernest Rutherford",
  options: ["Ernest Rutherford","Newton","Curie","Tesla"]
},

{
  question: "The atomic nucleus was discovered by whom?",
  answer: "Ernest Rutherford",
  options: ["Ernest Rutherford","Bell","Marconi","Fleming"]
},

/* =========================
   NIELS BOHR
========================= */

{
  question: "Who developed the Bohr Model of the atom?",
  answer: "Niels Bohr",
  options: ["Niels Bohr","Rutherford","Thomson","Chadwick"]
},

{
  question: "Which scientist explained how electrons move around the nucleus?",
  answer: "Niels Bohr",
  options: ["Niels Bohr","Einstein","Newton","Darwin"]
},

{
  question: "The Bohr Model is associated with whom?",
  answer: "Niels Bohr",
  options: ["Niels Bohr","Pasteur","Mendel","Hooke"]
},

/* =========================
   DMITRI MENDELEEV
========================= */

{
  question: "Who created the periodic table?",
  answer: "Dmitri Mendeleev",
  options: ["Dmitri Mendeleev","Niels Bohr","Ernest Rutherford","J. J. Thomson"]
},

{
  question: "Which scientist organized the chemical elements into a table?",
  answer: "Dmitri Mendeleev",
  options: ["Dmitri Mendeleev","Newton","Einstein","Curie"]
},

{
  question: "The periodic table was developed by whom?",
  answer: "Dmitri Mendeleev",
  options: ["Dmitri Mendeleev","Faraday","Tesla","Bell"]
},

/* =========================
   ROBERT HOOKE
========================= */

{
  question: "Who discovered and named the cell?",
  answer: "Robert Hooke",
  options: ["Robert Hooke","Gregor Mendel","Louis Pasteur","Charles Darwin"]
},

{
  question: "Which scientist studied cork and named the cell?",
  answer: "Robert Hooke",
  options: ["Robert Hooke","Newton","Einstein","Tesla"]
},

{
  question: "The term 'cell' was introduced by whom?",
  answer: "Robert Hooke",
  options: ["Robert Hooke","Bohr","Rutherford","Chadwick"]
},

/* =========================
   ANTONIE VAN LEEUWENHOEK
========================= */

{
  question: "Who improved microscopes and observed tiny organisms?",
  answer: "Antonie van Leeuwenhoek",
  options: ["Antonie van Leeuwenhoek","Robert Hooke","Louis Pasteur","Gregor Mendel"]
},

{
  question: "Which scientist was among the first to observe microorganisms?",
  answer: "Antonie van Leeuwenhoek",
  options: ["Antonie van Leeuwenhoek","Newton","Einstein","Darwin"]
},

{
  question: "Tiny living organisms were first observed by whom?",
  answer: "Antonie van Leeuwenhoek",
  options: ["Antonie van Leeuwenhoek","Bell","Marconi","Volta"]
},

/* =========================
   C. V. RAMAN
========================= */

{
  question: "Who discovered the Raman Effect?",
  answer: "C. V. Raman",
  options: ["C. V. Raman","Homi J. Bhabha","Vikram Sarabhai","A. P. J. Abdul Kalam"]
},

{
  question: "Which Indian scientist made important contributions to physics through the Raman Effect?",
  answer: "C. V. Raman",
  options: ["C. V. Raman","Ramanujan","Aryabhata","Bose"]
},

{
  question: "The Raman Effect is associated with whom?",
  answer: "C. V. Raman",
  options: ["C. V. Raman","Newton","Einstein","Curie"]
},

/* =========================
   JAGADISH CHANDRA BOSE
========================= */

{
  question: "Who studied plant responses and made early contributions to radio science?",
  answer: "Jagadish Chandra Bose",
  options: ["Jagadish Chandra Bose","C. V. Raman","Homi J. Bhabha","Vikram Sarabhai"]
},

{
  question: "Which Indian scientist researched plant sensitivity?",
  answer: "Jagadish Chandra Bose",
  options: ["Jagadish Chandra Bose","Ramanujan","Aryabhata","Kalam"]
},

{
  question: "Plant response studies are associated with whom?",
  answer: "Jagadish Chandra Bose",
  options: ["Jagadish Chandra Bose","Faraday","Tesla","Bell"]
},

/* =========================
   HOMI J. BHABHA
========================= */

{
  question: "Who laid the foundation for India's nuclear programme?",
  answer: "Homi J. Bhabha",
  options: ["Homi J. Bhabha","Vikram Sarabhai","A. P. J. Abdul Kalam","C. V. Raman"]
},

{
  question: "India's nuclear programme is closely associated with whom?",
  answer: "Homi J. Bhabha",
  options: ["Homi J. Bhabha","Ramanujan","Aryabhata","Bose"]
},

{
  question: "Which scientist is known as the father of India's nuclear programme?",
  answer: "Homi J. Bhabha",
  options: ["Homi J. Bhabha","Newton","Einstein","Tesla"]
},

/* =========================
   VIKRAM SARABHAI
========================= */

{
  question: "Who is known as the father of the Indian space programme?",
  answer: "Vikram Sarabhai",
  options: ["Vikram Sarabhai","Homi J. Bhabha","A. P. J. Abdul Kalam","C. V. Raman"]
},

{
  question: "India's space programme was pioneered by whom?",
  answer: "Vikram Sarabhai",
  options: ["Vikram Sarabhai","Ramanujan","Aryabhata","Bose"]
},

{
  question: "Which scientist played a major role in developing India's space vision?",
  answer: "Vikram Sarabhai",
  options: ["Vikram Sarabhai","Faraday","Bell","Marconi"]
},

/* =========================
   A. P. J. ABDUL KALAM
========================= */

{
  question: "Who advanced missile technology in India?",
  answer: "A. P. J. Abdul Kalam",
  options: ["A. P. J. Abdul Kalam","Vikram Sarabhai","Homi J. Bhabha","C. V. Raman"]
},

{
  question: "Who is popularly known as the Missile Man of India?",
  answer: "A. P. J. Abdul Kalam",
  options: ["A. P. J. Abdul Kalam","Jagadish Chandra Bose","Ramanujan","Aryabhata"]
},

{
  question: "Which scientist inspired millions through science and education?",
  answer: "A. P. J. Abdul Kalam",
  options: ["A. P. J. Abdul Kalam","Newton","Einstein","Darwin"]
},

/* =========================
   SRINIVASA RAMANUJAN
========================= */

{
  question: "Who made extraordinary contributions to mathematics through brilliant discoveries?",
  answer: "Srinivasa Ramanujan",
  options: ["Srinivasa Ramanujan","Aryabhata","C. V. Raman","Jagadish Chandra Bose"]
},

{
  question: "Which Indian mathematician became famous for remarkable number theories?",
  answer: "Srinivasa Ramanujan",
  options: ["Srinivasa Ramanujan","Newton","Einstein","Tesla"]
},

{
  question: "Mathematical genius Srinivasa Ramanujan belonged to which field?",
  answer: "Mathematics",
  options: ["Mathematics","Physics","Biology","Chemistry"]
},

/* =========================
   ARYABHATA
========================= */

{
  question: "Who made important contributions to mathematics and astronomy in ancient India?",
  answer: "Aryabhata",
  options: ["Aryabhata","Ramanujan","C. V. Raman","Abdul Kalam"]
},

{
  question: "Which ancient Indian scholar contributed to astronomy and mathematics?",
  answer: "Aryabhata",
  options: ["Aryabhata","Newton","Einstein","Darwin"]
},

{
  question: "Ancient Indian mathematics is closely associated with whom?",
  answer: "Aryabhata",
  options: ["Aryabhata","Tesla","Bell","Marconi"]
}

];

export default function ScientistsQuiz() {

/* =========================================
   STATES
========================================= */

const [videoEnded,setVideoEnded] = useState(false);
const [startQuiz,setStartQuiz] = useState(false);
const [quizCompleted,setQuizCompleted] = useState(false);

const [questions,setQuestions] = useState([]);
const [currentQuestion,setCurrentQuestion] = useState(0);

const [score,setScore] = useState(0);
const [selectedOption,setSelectedOption] = useState(0);

const [options,setOptions] = useState([]);
const [message,setMessage] = useState("");

const [showImages,setShowImages] = useState(false);
const [currentImage,setCurrentImage] = useState(0);

const [selectedMenu,setSelectedMenu] = useState(0);

const [scoreHistory,setScoreHistory] = useState(JSON.parse(localStorage.getItem("scientistsQuizHistory") || "[]"));
const isMobile = window.innerWidth <= 768;

/* =========================================
   IMAGES
========================================= */

const scientistImages = [
  page1,
  page2,
  page3,
  page4,
  page5,
  page6
];

/* =========================================
   SHUFFLE ARRAY
========================================= */

const shuffleArray = (array) => {

  const arr = [...array];

  for (let i = arr.length - 1; i > 0; i--) {

    const j = Math.floor(
      Math.random() * (i + 1)
    );

    [arr[i],arr[j]] = [arr[j],arr[i]];
  }

  return arr;
};

/* =========================================
   START QUIZ
========================================= */

const beginQuiz = () => {

  const shuffledQuestions =
    shuffleArray(ALL_QUESTIONS)
      .slice(0,15)
      .map(q => ({
        ...q,
        options: shuffleArray(q.options)
      }));

  setQuestions(shuffledQuestions);

  setCurrentQuestion(0);
  setScore(0);

  setOptions(shuffledQuestions[0].options);

  setSelectedOption(0);

  setQuizCompleted(false);

  setMessage("");

  setStartQuiz(true);
};

/* =========================================
   NEXT QUESTION
========================================= */

const moveToNextQuestion = (selectedAnswer) => {

  const current = questions[currentQuestion];
  const isCorrect = selectedAnswer === current.answer;
  const updatedScore = isCorrect ? score + 1 : score;
  if (isCorrect) {
    setScore(updatedScore);
    setMessage("✅ Correct!");
  } else {
    setMessage(`❌ Correct Answer: ${current.answer}`);
  }

  setTimeout(() => {

    const nextIndex =currentQuestion + 1;

    if (nextIndex >= questions.length) {

      const history = [
        {
          score: updatedScore,
          total: questions.length,
          date: new Date().toLocaleString()
        },
        ...scoreHistory
      ];

      setScoreHistory(history);
      localStorage.setItem("scientistsQuizHistory",JSON.stringify(history));
      setQuizCompleted(true);

      return;
    }

    const nextQuestion =questions[nextIndex];
    setCurrentQuestion(nextIndex);
    setOptions(nextQuestion.options);
    setSelectedOption(0);
    setMessage("");
  },1200);
};

/* =========================================
   PERFORMANCE TEXT
========================================= */

const getPerformanceText = () => {

  const percentage =(score / questions.length) * 100;

  if (percentage >= 90) {
    return "🏆 Science Legend";
  }

  if (percentage >= 75) {
    return "⭐⭐⭐ Genius Scientist";
  }

  if (percentage >= 50) {
    return "⭐⭐ Great Researcher";
  }

  return "⭐ Keep Learning";
};

/* =========================================
   TV REMOTE CONTROLS
========================================= */

useEffect(() => {

  const handleKey = (e) => {

    /* =====================
       IMAGE SCREEN
    ===================== */

    if (showImages) {

      if (e.key === "ArrowRight") {
        setCurrentImage(prev =>
          prev === scientistImages.length - 1 ? 0 : prev + 1);
      }

      if (e.key === "ArrowLeft") {
        setCurrentImage(prev =>
          prev === 0 ? scientistImages.length - 1 : prev - 1);
      }

      if (e.key === "Escape" || e.key === "Backspace") {
        setShowImages(false);
      }

      return;
    }

    /* =====================
       START SCREEN
    ===================== */

    if (videoEnded && !startQuiz && !showImages) {
      if (e.key === "ArrowUp") {
        setSelectedMenu(prev =>
          prev === 0 ? 2 : prev - 1);
      }

      if (e.key === "ArrowDown") {
        setSelectedMenu(prev =>prev === 2 ? 0 : prev + 1);
      }

      if (e.key === "Enter") {
        if (selectedMenu === 0) {
          beginQuiz();
        }

        if (selectedMenu === 1) {
          setShowImages(true);
        }

        if (selectedMenu === 2) {
          setVideoEnded(false);
        }
      }

      return;
    }

    /* =====================
       QUIZ SCREEN
    ===================== */

    if (startQuiz && !quizCompleted) {
      if (e.key === "ArrowUp") {
        setSelectedOption(prev =>
          prev === 0 ? options.length - 1 : prev - 1);
      }

      if (e.key === "ArrowDown") {
        setSelectedOption(prev =>
          prev === options.length - 1 ? 0 : prev + 1);
      }

      if (e.key === "Enter") {
        moveToNextQuestion(options[selectedOption]);
      }
    }

    /* =====================
       RESULT SCREEN
    ===================== */

    if (quizCompleted && e.key === "Enter") {
      beginQuiz();
    }

  };

  window.addEventListener("keydown",handleKey);

  return () =>
    window.removeEventListener("keydown",handleKey);

},[videoEnded,startQuiz,quizCompleted,selectedOption,options,questions,currentQuestion,showImages,currentImage]);

/* =========================================
   VIDEO SCREEN
========================================= */

if (!videoEnded) {

  return (

    <div
      style={{
        minHeight: "100vh",
        background:"linear-gradient(135deg,#020617,#0f172a,#1e3a8a,#7c3aed)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px"
      }}
    >
      <div
        onClick={() => setVideoEnded(true)}
        style={{
        position:"absolute",
        top:"50px",
        right:"25px",
        background:"linear-gradient(135deg,#f59e0b,#fbbf24)",
        fontSize:isMobile ? "16px" : "24px",
        padding:isMobile ? "10px 18px" : "15px 35px",
        borderRadius:"18px",
        color:"#fff",
        fontWeight:"700",
        cursor:"pointer",
        zIndex:"999"
        }}
        >
        ⏭ Skip Video
        </div>

      <video
        autoPlay
        controls
        onEnded={() => setVideoEnded(true)}
        style={{
          width:"100%",
          maxWidth:"1200px",
          maxHeight: "90vh",
          borderRadius: "30px",
          boxShadow:"0 15px 50px rgba(0,0,0,.5)"
        }}
      >
        <source src={ScientistsVideo} type="video/mp4"/> 
      </video>

    </div>

  );
}

/* =========================================
   IMAGE SCREEN
========================================= */

if (showImages) {

  return (

    <div
      style={{
        minHeight: "100vh",
        background:"linear-gradient(135deg,#020617,#111827,#1e293b)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}
    >

      <img
        src={scientistImages[currentImage]}
        alt=""
        style={{
          width: "90%",
          maxHeight: "80vh",
          objectFit: "contain",
          borderRadius: "25px"
        }}
      />
        <div
          style={{
            display: "flex",
            gap: "20px",
            justifyContent: "center",
            marginTop: "20px",
            flexWrap: "wrap",
          }}
        >
          <div
            onClick={() =>
              setCurrentImage(prev => prev === 0 ? scientistImages.length - 1 : prev - 1)
            }
            style={{
              padding: "14px 28px",
              background: "#2563eb",
              color: "#fff",
              borderRadius: "15px",
              cursor: "pointer",
              fontWeight: "700",
            }}
          >
            ⬅ Previous
          </div>

          <div
            onClick={() =>
              setCurrentImage(prev =>prev === scientistImages.length - 1 ? 0 : prev + 1)
            }
            style={{
              padding: "14px 28px",
              background: "#2563eb",
              color: "#fff",
              borderRadius: "15px",
              cursor: "pointer",
              fontWeight: "700",
            }}
          >
            Next ➡
          </div>
      </div>
      <div
        style={{
          color: "#fff",
          fontSize: "30px",
          marginTop: "20px"
        }}
      >
        ◀ LEFT | RIGHT ▶
      </div>

      <div
        style={{
          color: "#cbd5e1",
          fontSize: "24px",
          marginTop: "10px"
        }}
      >
        {currentImage + 1}
        /
        {scientistImages.length}
      </div>

      <div
        onClick={() => setShowImages(false)}
        style={{
          marginTop: "25px",
          background:"linear-gradient(135deg,#2563eb,#7c3aed)",
          color: "#fff",
          padding: "18px 40px",
          borderRadius: "18px",
          fontSize: "24px",
          fontWeight: "700",
          cursor: "pointer"
        }}
      >
        🔙 Back To Quiz Menu
      </div>

    </div>

  );
}

/* =========================================
   START SCREEN
========================================= */

if (!startQuiz) {

  return (

    <div
      style={{
        minHeight: "100vh",
        background:"linear-gradient(135deg,#020617,#1e3a8a,#7c3aed)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "10px",
        fontFamily:"Poppins,sans-serif"
      }}
    >

      <div
        style={{
          width: "100%",
          maxWidth: "1100px",
          background:"rgba(255,255,255,.12)",
          backdropFilter:"blur(15px)",
          border:"1px solid rgba(255,255,255,.2)",
          borderRadius: "35px",
          padding: "60px",
          textAlign: "center",
        }}
      >

        <div
          style={{
            fontSize: "80px",
            marginBottom: "15px"
          }}
        >
          🔬
        </div>

        <h1
          style={{
            color: "#fff",
            fontSize:isMobile ? "25px" : "65px",
            marginBottom: "20px"
          }}
        >
          Great Scientists Quiz
        </h1>

        <p
          style={{
            color: "#e2e8f0",
            fontSize:isMobile ? "15px" : "28px",
            lineHeight: "1.4",
            marginBottom: "35px"
          }}
        >
          Discover the world's greatest
          scientists, inventors and
          mathematicians through a fun
          interactive quiz.
        </p>

        {/* START */}

        <div
          onClick={beginQuiz}
          style={{
            background:selectedMenu === 0 ? "linear-gradient(135deg,#2563eb,#1d4ed8)" : "linear-gradient(135deg,#3b82f6,#2563eb)",
            color: "#fff",
            fontSize:isMobile ? "20px" : "34px",
            padding:isMobile ? "16px" : "24px",
            borderRadius: "20px",
            fontWeight: "700",
            marginBottom: "15px",
            cursor: "pointer"
          }}
        >
          ▶ Start Quiz
        </div>

        {/* IMAGES */}

        <div
          onClick={() =>
            setShowImages(true)
          }
          style={{
            background:selectedMenu === 1 ? "linear-gradient(135deg,#16a34a,#15803d)" : "linear-gradient(135deg,#22c55e,#16a34a)",
            color: "#fff",
            fontSize:isMobile ? "20px" : "34px",
            padding:isMobile ? "16px" : "24px",
            borderRadius: "20px",
            fontWeight: "700",
            marginBottom: "20px",
            cursor: "pointer"
          }}
        >
          🖼 Scientists Gallery
        </div>

        {/* VIDEO */}

        <div
          onClick={() => {
            setVideoEnded(false);
          }}
          style={{
            background:"linear-gradient(135deg,#f59e0b,#d97706)",
            color: "#fff",
            fontSize:isMobile ? "20px" : "34px",
            padding:isMobile ? "16px" : "24px",
            borderRadius: "20px",
            fontWeight: "700",
            cursor: "pointer"
          }}
        >
          🎥 Watch Video Again
        </div>

        <div
          style={{
            marginTop: "35px",
            color: "#cbd5e1",
            fontSize: "22px"
          }}
        >
          ↑ ↓ Navigate • OK / Enter Select
        </div>

      </div>

    </div>

  );
}/* =========================================
   RESULT SCREEN
========================================= */

if (quizCompleted) {

  return (

    <div
      style={{
        minHeight: "100vh",
        background:"linear-gradient(135deg,#020617,#1e3a8a,#7c3aed)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        padding: "30px",
        fontFamily: "Poppins,sans-serif"
      }}
    >

      <h1
        style={{
          fontSize: "30px",
          color: "#ffffff",
          marginBottom: "25px"
        }}
      >
        🎉 Quiz Completed
      </h1>

      <div
        style={{
          width:isMobile ? "150px" : "230px",
          height:isMobile ? "150px" : "230px",
          fontSize:isMobile ? "36px" : "58px",
          borderRadius: "50%",
          background:"linear-gradient(135deg,#2563eb,#7c3aed)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#fff",
          fontWeight: "900",
          marginBottom: "25px"
        }}
      >
        {score}/{questions.length}
      </div>

      <h2
        style={{
          fontSize: "36px",
          color: "#fff",
          marginBottom: "30px"
        }}
      >
        {getPerformanceText()}
      </h2>

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          marginBottom: "35px"
        }}
      >

        <div
          onClick={beginQuiz}
          style={{
            background:"linear-gradient(135deg,#22c55e,#16a34a)",
            color: "#fff",
            padding: "20px 45px",
            borderRadius: "20px",
            fontSize: "24px",
            fontWeight: "700",
            cursor: "pointer"
          }}
        >
          🔄 Play Again
        </div>

        <div
          onClick={() => {

            setVideoEnded(false);
            setStartQuiz(false);
            setQuizCompleted(false);

          }}
          style={{
            background:"linear-gradient(135deg,#f59e0b,#d97706)",
            color: "#fff",
            padding: "20px 45px",
            borderRadius: "20px",
            fontSize: "24px",
            fontWeight: "700",
            cursor: "pointer"
          }}
        >
          🎥 Watch Video Again
        </div>

      </div>

      {/* HISTORY */}

      <div
        style={{
          width: "900px",
          maxWidth: "95%",
          background:"rgba(255,255,255,.12)",
          backdropFilter: "blur(15px)",
          borderRadius: "25px",
          padding: "25px",
          color: "#fff",
          maxHeight: "350px",
          overflowY: "auto"
        }}
      >

        <h3
          style={{
            textAlign: "center",
            marginBottom: "5px"
          }}
        >
          📊 Quiz History
        </h3>

        {scoreHistory.length === 0? 
        (<div style={{textAlign: "center"}}>No Previous Attempts</div>)
            : (scoreHistory.map((item,index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      flexDirection:isMobile ? "column" : "row",
                      gap:"5px",
                      justifyContent:"space-between",
                      padding: "14px",
                      borderBottom:"1px solid rgba(255,255,255,.15)"
                    }}
                  >

                    <div>
                      Attempt #
                      {scoreHistory.length - index}
                    </div>

                    <div>
                      {item.score}/{item.total}
                    </div>

                    <div>
                      {item.date}
                    </div>

                  </div>

                )
              )
            )
        }

      </div>

    </div>

  );
}

/* =========================================
   QUIZ SCREEN
========================================= */

if (!questions.length)
  return null;

const current =questions[currentQuestion];

return (

  <div
    style={{
      minHeight: "100vh",
      background:"linear-gradient(135deg,#020617,#0f172a,#1e3a8a)",
      padding: "25px",
      fontFamily:"Poppins,sans-serif",
      overflowY: "auto"
    }}
  >

    {/* HEADER */}

    <div
      style={{
        textAlign: "center",
        marginBottom: "20px"
      }}
    >

      <h1
        style={{
          color: "#ffffff",
          fontSize:isMobile ? "30px" : "52px",
          marginBottom: "10px"
        }}
      >
        🔬 Scientists Quiz
      </h1>

      <h2
        style={{
          color: "#cbd5e1"
        }}
      >
        Question
        {" "}
        {currentQuestion + 1}
        {" / "}
        {questions.length}
      </h2>

    </div>

    {/* MAIN CARD */}

    <div
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        background:"rgba(255,255,255,.12)",
        backdropFilter:"blur(15px)",
        border:"1px solid rgba(255,255,255,.15)",
        borderRadius: "30px",
        padding: "30px"
      }}
    >

      {/* QUESTION */}

      <h2
        style={{
          textAlign: "center",
          color: "#ffffff",
          fontSize:isMobile ? "24px" : "34px",
          marginBottom: "30px",
          lineHeight: "1.5"
        }}
      >
        {current.question}
      </h2>

      {/* OPTIONS */}

      {
        options.map(
          (option,index) => (

            <div
              key={index}
              onClick={() => {
                setSelectedOption(index);
                moveToNextQuestion(option);
              }}
              style={{
                fontSize:isMobile ? "18px" : "28px",
                padding:isMobile ? "14px" : "18px",
                marginBottom: "15px",
                borderRadius: "18px",
                fontWeight: "700",
                cursor: "pointer",
                background:selectedOption === index ? "#2563eb" : "rgba(255,255,255,.15)",
                color: "#ffffff",
                border: selectedOption === index ? "4px solid #93c5fd" : "2px solid transparent"
              }}
            >

              {selectedOption === index ? "► " : ""}
              {option}

            </div>

          )
        )
      }

      {/* MESSAGE */}

      <div
        style={{
          minHeight: "50px",
          marginTop: "15px",
          textAlign: "center",
          fontSize: "26px",
          fontWeight: "700",
          color: "#4ade80"
        }}
      >
        {message}
      </div>

      {/* FOOTER */}

      <div
        style={{
          marginTop: "25px",
          textAlign: "center",
          color: "#cbd5e1",
          fontSize: "18px"
        }}
      >
        ↑ ↓ Navigate • OK / Enter Select
      </div>

      <div
        style={{
          marginTop: "20px",
          textAlign: "center",
          fontSize: "28px",
          fontWeight: "700",
          color: "#60a5fa"
        }}
      >
        Score: {score}
      </div>

    </div>

  </div>

);

}