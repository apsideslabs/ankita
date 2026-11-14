export function Ornament({ glyph = 'अ' }: { glyph?: string }) {
  return (
    <div className="orn" aria-hidden="true">
      <span>{glyph}</span>
    </div>
  );
}
