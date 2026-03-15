import express, { type Request, type Response } from "express";
import { contactValidation } from "../../middleware/validate.js";
import { successResponse, errorResponse } from "../../utils/response.js";
import contactService from "../../services/contact.service.js";

const router = express.Router();

router.get("/list", async (_req: Request, res: Response) => {
  try {
    const contacts = await contactService.findAll();
    res.status(200).json(successResponse(contacts));
  } catch (err) {
    console.error(err);
    res.status(500).json(errorResponse("Failed to retrieve contacts"));
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  const id = req.params.id as string;

  try {
    const contact = await contactService.findById(id);

    if (!contact) {
      res.status(404).json(errorResponse("Contact not found"));
      return;
    }

    res.status(200).json(successResponse(contact));
  } catch (err) {
    console.error(err);
    res.status(500).json(errorResponse("Failed to retrieve contact"));
  }
});

router.post("/", contactValidation.create, async (req: Request, res: Response) => {
  const { firstName, lastName, email } = req.body;

  try {
    const contact = await contactService.create({ firstName, lastName, email });

    res.status(201).json(successResponse(contact));
  } catch (err) {
    console.error(err);
    res.status(500).json(errorResponse("Failed to create contact"));
  }
});

router.put("/:id", contactValidation.update, async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { firstName, lastName, email } = req.body;

  try {
    const contact = await contactService.update(Number(id), { firstName, lastName, email });

    res.status(200).json(successResponse(contact));
  } catch (err) {
    console.error(err);
    res.status(500).json(errorResponse("Failed to update contact"));
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  const id = req.params.id as string;

  try {
    const contact = await contactService.delete(Number(id));

    res.status(200).json(successResponse(contact));
  } catch (err) {
    console.error(err);
    res.status(500).json(errorResponse("Failed to delete contact"));
  }
});

export default router;
