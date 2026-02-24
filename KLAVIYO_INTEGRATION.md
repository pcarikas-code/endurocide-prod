# Klaviyo Contact Form Integration Guide

This guide explains how to implement a custom contact form that submits data directly to a Klaviyo List using the Client API. This implementation is built with React and Tailwind CSS.

## 1. Add the Klaviyo Script

First, add the Klaviyo tracking script to the `<head>` of your `index.html` file. This script identifies the user and enables tracking.

```html
<!-- Replace 'W72Cww' with your Public API Key (Company ID) -->
<script async type="text/javascript" src="https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=W72Cww"></script>
```

## 2. React Component Implementation

Here is the complete React component code for the contact form. It handles form state, submission, and API communication.

### Required Dependencies
- `lucide-react` (for icons)
- `shadcn/ui` components (Button, Input, Textarea, Label, Alert, Card) - *or replace with standard HTML elements*

### The Component Code

```tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Send, AlertCircle, CheckCircle } from "lucide-react";

export default function ContactForm() {
  // State for form fields
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    message: ""
  });

  // State for submission status
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Configuration Constants
  const KLAVIYO_PUBLIC_API_KEY = 'W72Cww'; // Your Public API Key
  const WEB_ENQUIRIES_LIST_ID = 'RnuUrp';  // The List ID to subscribe users to

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    // Construct the JSON payload for Klaviyo API
    // Note: 'relationships' must be at the root of 'data', NOT inside 'attributes'
    const subscribePayload = {
      data: {
        type: 'subscription',
        attributes: {
          custom_source: 'Contact Us Form',
          profile: {
            data: {
              type: 'profile',
              attributes: {
                email: formData.email,
                first_name: formData.firstName,
                last_name: formData.lastName,
                phone_number: formData.phone || undefined,
                organization: formData.company || undefined,
                properties: {
                  message: formData.message,
                  source: 'Contact Us Form'
                }
              }
            }
          }
        },
        relationships: {
          list: {
            data: {
              type: 'list',
              id: WEB_ENQUIRIES_LIST_ID
            }
          }
        }
      }
    };

    try {
      // Send POST request to Klaviyo Client API
      const response = await fetch(`https://a.klaviyo.com/client/subscriptions/?company_id=${KLAVIYO_PUBLIC_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'revision': '2024-10-15' // Important: Use a specific API revision
        },
        body: JSON.stringify(subscribePayload)
      });

      if (response.ok || response.status === 202) {
        setStatus("success");
        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          company: "",
          message: ""
        });
      } else {
        const text = await response.text();
        console.error('Klaviyo API error:', text);
        throw new Error(`API returned status ${response.status}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again or email us directly.");
    }
  };

  // Render the form
  if (status === "success") {
    return (
      <Alert className="bg-green-50 border-green-200 text-green-800">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertTitle>Success!</AlertTitle>
        <AlertDescription>
          Thank you for your enquiry! We will be in touch shortly.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {status === "error" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input 
            id="firstName" 
            name="firstName" 
            value={formData.firstName} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input 
            id="lastName" 
            name="lastName" 
            value={formData.lastName} 
            onChange={handleChange} 
            required 
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input 
          id="email" 
          name="email" 
          type="email" 
          value={formData.email} 
          onChange={handleChange} 
          required 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input 
            id="phone" 
            name="phone" 
            type="tel" 
            value={formData.phone} 
            onChange={handleChange} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input 
            id="company" 
            name="company" 
            value={formData.company} 
            onChange={handleChange} 
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message *</Label>
        <Textarea 
          id="message" 
          name="message" 
          rows={5} 
          value={formData.message} 
          onChange={handleChange} 
          required 
        />
      </div>

      <Button type="submit" className="w-full md:w-auto" disabled={status === "submitting"}>
        {status === "submitting" ? (
          <>
            <span className="animate-spin mr-2">⏳</span> Sending...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" /> Send Enquiry
          </>
        )}
      </Button>
    </form>
  );
}
```

## 3. Key Configuration Details

### API Endpoint
- **URL:** `https://a.klaviyo.com/client/subscriptions/?company_id=YOUR_PUBLIC_API_KEY`
- **Method:** `POST`
- **Headers:**
  - `Content-Type: application/json`
  - `revision: 2024-10-15` (Required for the latest API version)

### Payload Structure
The structure is critical. The `relationships` object (which specifies the List ID) must be a sibling of `attributes`, not a child.

```json
{
  "data": {
    "type": "subscription",
    "attributes": {
      "custom_source": "Contact Us Form",
      "profile": {
        "data": {
          "type": "profile",
          "attributes": {
            "email": "user@example.com",
            "first_name": "John",
            "last_name": "Doe",
            "properties": {
              "message": "Hello world"
            }
          }
        }
      }
    },
    "relationships": {
      "list": {
        "data": {
          "type": "list",
          "id": "YOUR_LIST_ID"
        }
      }
    }
  }
}
```

## 4. Troubleshooting

- **400 Bad Request:** Usually means the JSON payload structure is incorrect. Check that `relationships` is not nested inside `attributes`.
- **CORS Error:** Ensure you are using the Client API (`https://a.klaviyo.com/client/...`) and not the server-side API (`https://a.klaviyo.com/api/...`). The Client API is designed for frontend use.
- **401 Unauthorized:** Check your Public API Key (Company ID).
