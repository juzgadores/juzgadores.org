import { unstable_flag as featureFlag } from "@vercel/flags/next";
import type { JsonValue } from "@vercel/flags";
import { get } from "@vercel/edge-config";

export const {
  standbyFlag,
  contactEmailFlag,
  aspirantesProfileFlag,
  aspiranteLinksFlag,
  aspirantesFilterBarFlag,
} = {
  standbyFlag: flag("standby", false),
  contactEmailFlag: flag("contact-email", "contacto@juzgadores.org"),
  aspirantesProfileFlag: flag("aspirantes-profile", true),
  aspiranteLinksFlag: flag("aspirante-links", true),
  aspirantesFilterBarFlag: flag("aspirantes-filter-bar", true),
};

function flag<T extends JsonValue>(key: string, defaultValue: T) {
  const envValue = process.env[key.replace(/-/g, "_").toUpperCase()];
  const type = typeof defaultValue;
  return featureFlag({
    key,
    decide:
      envValue === undefined
        ? async () => (await get(key)) ?? defaultValue
        : () => {
            return type === "boolean"
              ? ["true", "1"].includes(envValue)
              : type === "string"
                ? envValue
                : JSON.parse(envValue);
          },
  });
}
