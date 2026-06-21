// lib/xmlParser.ts
import { XMLParser } from "fast-xml-parser";

export async function parseNFeXml(xmlContent: string) {
  try {
    const parser = new XMLParser({ ignoreAttributes: false });
    const jsonObj = parser.parse(xmlContent);

    // Verifica se a estrutura da NFe existe no XML
    if (!jsonObj.nfeProc || !jsonObj.nfeProc.NFe) {
      throw new Error("Arquivo XML inválido ou não é uma NFe.");
    }

    const nfe = jsonObj.nfeProc.NFe.infNFe;

    // Extraindo dados com segurança (usando ?. para evitar erro se a tag não existir)
    return {
      provider: nfe.emit?.xNome || "Fornecedor não identificado",
      date: nfe.ide?.dhEmi ? new Date(nfe.ide.dhEmi) : new Date(),
      totalValue: nfe.total?.ICMSTot?.vNF
        ? parseFloat(nfe.total.ICMSTot.vNF)
        : 0,
      description: `Nota Fiscal de ${nfe.emit?.xNome || "Serviços"}`,
      // Se precisar de itens, a lógica permanece, mas vamos focar no essencial primeiro
    };
  } catch (error) {
    console.error("Erro ao processar XML:", error);
    throw new Error("Falha ao ler o arquivo XML. Verifique o formato.");
  }
}
