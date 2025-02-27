"use server";

import { symmetricEncrypt } from "@/lib/encryption";
import prisma from "@/lib/prisma";
import {
  createCredentialSchema,
  createCredentialSchemaType,
} from "@/schema/credential";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function CreateCredential(form: createCredentialSchemaType) {
  const { success, data } = createCredentialSchema.safeParse(form);
  if (!success) {
    throw new Error("invalid form data");
  }

  const address = cookies().get('walletAddress')?.value;
  if (!address) {
    throw new Error("unauthenticated");
  }

  // Encrypt value
  const encryptedValue = symmetricEncrypt(data.value);

  const result = await prisma.credential.create({
    data: {
      userId:address,
      name: data.name,
      value: encryptedValue,
    },
  });

  if (!result) {
    throw new Error("failed to create credential");
  }

  revalidatePath("/credentials");
}
