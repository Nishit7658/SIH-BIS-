from backend.services.chunker import chunk_text_800_1000

sample_bis_text = """
Clause 4.1 General Requirements
Insulating parts retaining live parts in position shall be subjected to a glow-wire test at a temperature of 850°C.
The sample is deemed to have passed if there is no visible flame and no sustained glowing, or if flames extinguish within 30 seconds.

| Parameter | Specification | Test Method |
| --- | --- | --- |
| Voltage Rating | Up to 250 V | Clause 5.1 |
| Current Rating | 6A, 10A, 16A | Clause 5.2 |
| Earthing Pin | Mandatory | Clause 6.1 |

Clause 4.2 Mechanical Strength
The plugs and socket-outlets shall have adequate mechanical strength to withstand the stresses met with during installation and use.
Compliance is checked by submitting the specimens to the tumbling barrel test described in Clause 24.2.
After 1000 falls in the tumbling barrel, the specimens shall show no damage within the meaning of this standard.

Clause 4.3 Resistance to Ageing and Humidity
Specimens are kept in a humidity cabinet containing air with a relative humidity between 91% and 95% at (27 ± 2)°C.
The specimens are kept in the cabinet for 7 days (168 hours) for normal protection.
Immediately after this treatment, specimens shall withstand dielectric withstand voltage test.
""" * 5 # Expand to test accumulation

chunks = chunk_text_800_1000(sample_bis_text, {'code': 'IS 1293:2019'})
print(f"Generated Chunks count: {len(chunks)}")
for c in chunks:
    print(f"Chunk #{c['chunkIndex']} | Tokens: {c['estimatedTokens']} | Primary Clause: {c['primaryClause']} | Clauses: {c['clausesCovered']} | Table: {c['hasTable']}")
    print(f"Preview:\n{c['text'][:140]}...\n")
