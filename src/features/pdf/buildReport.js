import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

/**
 * @param {object} opts
 * @param {Record<string, unknown>} opts.profileSummary
 * @param {{ applies: object[], mayApplyLater: object[], doesNotApply: object[] }} opts.taxGroups
 * @param {{ gross: number, irpp: number, cnps: number, net: number, totalDeductions: number } | null} opts.estimate
 * @param {string[]} opts.checklist
 */
export async function buildTaxReportPdf(opts) {
  const doc = await PDFDocument.create()
  const font = await doc.embedFont(StandardFonts.Helvetica)
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold)
  const margin = 50
  const line = 14
  let page = doc.addPage()
  let y = page.getHeight() - margin

  const drawTitle = (text) => {
    if (y < margin + 40) {
      page = doc.addPage()
      y = page.getHeight() - margin
    }
    page.drawText(text, {
      x: margin,
      y,
      size: 16,
      font: fontBold,
      color: rgb(0.2, 0.1, 0.35),
    })
    y -= line * 2
  }

  const drawPara = (text) => {
    const words = text.split(/\s+/)
    let current = ''
    for (const w of words) {
      const test = current ? `${current} ${w}` : w
      if (font.widthOfTextAtSize(test, 11) > page.getWidth() - 2 * margin) {
        if (y < margin + line) {
          page = doc.addPage()
          y = page.getHeight() - margin
        }
        page.drawText(current, { x: margin, y, size: 11, font })
        y -= line
        current = w
      } else {
        current = test
      }
    }
    if (current) {
      if (y < margin + line) {
        page = doc.addPage()
        y = page.getHeight() - margin
      }
      page.drawText(current, { x: margin, y, size: 11, font })
      y -= line * 1.5
    }
  }

  drawTitle('TaxClarity Cameroon — Tax report')
  drawPara(
    'This report is informational only and does not constitute tax, legal, or accounting advice.',
  )
  y -= line

  drawTitle('1. Profile summary')
  drawPara(JSON.stringify(opts.profileSummary, null, 2))
  y -= line

  drawTitle('2. Applicable taxes')
  for (const t of opts.taxGroups.applies) {
    drawPara(`[Applies] ${t.name} (${t.code})`)
  }
  for (const t of opts.taxGroups.mayApplyLater) {
    drawPara(`[May apply later] ${t.name} (${t.code})`)
  }
  for (const t of opts.taxGroups.doesNotApply) {
    drawPara(`[Does not apply] ${t.name} (${t.code})`)
  }
  y -= line

  drawTitle('3. Estimation (monthly, XAF)')
  if (opts.estimate) {
    drawPara(`Gross: ${opts.estimate.gross.toLocaleString('fr-CM')}`)
    drawPara(`IRPP: ${opts.estimate.irpp.toLocaleString('fr-CM')}`)
    drawPara(`CNPS (4.2%): ${opts.estimate.cnps.toLocaleString('fr-CM')}`)
    drawPara(`Total deductions: ${opts.estimate.totalDeductions.toLocaleString('fr-CM')}`)
    drawPara(`Take-home (net): ${opts.estimate.net.toLocaleString('fr-CM')}`)
  } else {
    drawPara('No estimation included in this export.')
  }
  y -= line

  drawTitle('4. Checklist')
  for (const item of opts.checklist.length ? opts.checklist : ['(none)']) {
    drawPara(`- ${item}`)
  }
  y -= line

  drawTitle('5. Disclaimer')
  drawPara(
    'TaxClarity provides estimates based on simplified rules. Consult a qualified professional and official guidance for your situation.',
  )

  return doc.save()
}

export function downloadPdfBlob(bytes, filename = 'taxclarity-report.pdf') {
  const blob = new Blob([bytes], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * @param {Uint8Array} bytes
 * @param {string} filename
 */
export async function sharePdfIfSupported(bytes, filename) {
  const file = new File([bytes], filename, { type: 'application/pdf' })
  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    await navigator.share({ files: [file], title: 'Tax report' })
    return true
  }
  return false
}
