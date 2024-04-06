describe("endpoint 'api/v1/status'", () => {
  it("should return status 200 and return all property", async () => {
    const response = await fetch("http://localhost:3000/v1/status");

    expect(response.status).toBe(200);

    const responseBody = await response.json();

    const parsedUpdatedAt = new Date(responseBody.update_at).toISOString();
    expect(parsedUpdatedAt).toEqual(responseBody.update_at);

    expect(responseBody.dependencies.database.version).toBe("16.0");

    expect(responseBody.dependencies.database.max_connections).toBe(100);

    expect(responseBody.dependencies.database.opened_connections).toBe(1);
  });
});
